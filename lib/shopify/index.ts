import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';

import { ShopifyAPIError } from './errors';
import { globalRateLimiter } from './rate-limiter';
import { DEFAULT_RETRY_OPTIONS, withRetry } from './retry';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  if (!globalRateLimiter.canMakeRequest()) {
    throw new ShopifyAPIError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429, 'Rate Limiter');
  }

  globalRateLimiter.addRequest();

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      const firstError = body.errors[0];
      throw new ShopifyAPIError(
        firstError.message,
        firstError.code || 'UNKNOWN_ERROR',
        result.status,
        'Shopify API'
      );
    }

    if (!result.ok) {
      throw new ShopifyAPIError(
        `HTTP Error: ${result.statusText}`,
        'HTTP_ERROR',
        result.status,
        'Shopify API'
      );
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (e instanceof ShopifyAPIError) {
      throw e;
    }

    if (e instanceof Error) {
      throw new ShopifyAPIError(e.message, 'NETWORK_ERROR', 500, 'Shopify API');
    }

    throw new ShopifyAPIError('An unknown error occurred', 'UNKNOWN_ERROR', 500, 'Shopify API');
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyCreateCartOperation>({
      query: createCartMutation,
      cache: 'no-store'
    });

    if (!res.body.data?.cartCreate?.cart) {
      throw new ShopifyAPIError('Failed to create cart', 'CART_ERROR', 400, 'Cart Operation');
    }

    return reshapeCart(res.body.data.cartCreate.cart);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyAddToCartOperation>({
      query: addToCartMutation,
      variables: {
        cartId,
        lines
      },
      cache: 'no-store'
    });

    if (!res.body.data?.cartLinesAdd?.cart) {
      throw new ShopifyAPIError('Failed to add items to cart', 'CART_ERROR', 400, 'Cart Operation');
    }

    return reshapeCart(res.body.data.cartLinesAdd.cart);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
      query: removeFromCartMutation,
      variables: {
        cartId,
        lineIds
      },
      cache: 'no-store'
    });

    if (!res.body.data?.cartLinesRemove?.cart) {
      throw new ShopifyAPIError(
        'Failed to remove items from cart',
        'CART_ERROR',
        400,
        'Cart Operation'
      );
    }

    return reshapeCart(res.body.data.cartLinesRemove.cart);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyUpdateCartOperation>({
      query: editCartItemsMutation,
      variables: {
        cartId,
        lines
      },
      cache: 'no-store'
    });

    if (!res.body.data?.cartLinesUpdate?.cart) {
      throw new ShopifyAPIError('Failed to update cart', 'CART_ERROR', 400, 'Cart Operation');
    }

    return reshapeCart(res.body.data.cartLinesUpdate.cart);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyCartOperation>({
      query: getCartQuery,
      variables: { cartId },
      tags: [TAGS.cart]
    });

    // Old carts become `null` when you checkout.
    if (!res.body.data?.cart) {
      return undefined;
    }

    return reshapeCart(res.body.data.cart);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      tags: [TAGS.collections],
      variables: {
        handle
      }
    });

    return reshapeCollection(res.body.data.collection);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      tags: [TAGS.collections, TAGS.products],
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
      }
    });

    if (!res.body.data?.collection) {
      console.log(`No collection found for \`${collection}\``);
      return [];
    }

    return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getCollections(): Promise<Collection[]> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
      tags: [TAGS.collections]
    });

    const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
    const collections = [
      {
        handle: '',
        title: 'All',
        description: 'All products',
        seo: {
          title: 'All',
          description: 'All products'
        },
        path: '/search',
        updatedAt: new Date().toISOString()
      },
      ...reshapeCollections(shopifyCollections).filter(
        (collection) => !collection.handle.startsWith('hidden')
      )
    ];

    return collections;
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getMenu(handle: string): Promise<Menu[]> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyMenuOperation>({
      query: getMenuQuery,
      tags: [TAGS.collections],
      variables: {
        handle
      }
    });

    return (
      res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
        title: item.title,
        path: item.url.replace(domain, '').replace('/collections', '/search').replace('/pages', '')
      })) || []
    );
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getPage(handle: string): Promise<Page> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyPageOperation>({
      query: getPageQuery,
      cache: 'no-store',
      variables: { handle }
    });

    if (!res.body.data?.pageByHandle) {
      throw new ShopifyAPIError('Page not found', 'NOT_FOUND', 404, 'Page Operation');
    }

    return res.body.data.pageByHandle;
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getPages(): Promise<Page[]> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyPagesOperation>({
      query: getPagesQuery,
      cache: 'no-store'
    });

    return removeEdgesAndNodes(res.body.data.pages);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      tags: [TAGS.products],
      variables: {
        handle
      }
    });

    return reshapeProduct(res.body.data.product, false);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
      query: getProductRecommendationsQuery,
      tags: [TAGS.products],
      variables: {
        productId
      }
    });

    return reshapeProducts(res.body.data.productRecommendations);
  }, DEFAULT_RETRY_OPTIONS);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  return withRetry(async () => {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      tags: [TAGS.products],
      variables: {
        query,
        reverse,
        sortKey
      }
    });

    if (!res.body.data?.products) {
      throw new ShopifyAPIError(
        'Failed to fetch products',
        'PRODUCTS_ERROR',
        400,
        'Products Operation'
      );
    }

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  }, DEFAULT_RETRY_OPTIONS);
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  try {
    // We always need to respond with a 200 status code to Shopify,
    // otherwise it will continue to retry the request.
    const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
    const productWebhooks = ['products/create', 'products/delete', 'products/update'];
    const topic = (await headers()).get('x-shopify-topic') || 'unknown';
    const secret = req.nextUrl.searchParams.get('secret');
    const isCollectionUpdate = collectionWebhooks.includes(topic);
    const isProductUpdate = productWebhooks.includes(topic);

    if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
      throw new ShopifyAPIError(
        'Invalid revalidation secret',
        'INVALID_SECRET',
        401,
        'Revalidation'
      );
    }

    if (!isCollectionUpdate && !isProductUpdate) {
      // We don't need to revalidate anything for any other topics.
      return NextResponse.json({ status: 200 });
    }

    if (isCollectionUpdate) {
      await revalidateTag(TAGS.collections);
    }

    if (isProductUpdate) {
      await revalidateTag(TAGS.products);
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      topic,
      updatedCollections: isCollectionUpdate,
      updatedProducts: isProductUpdate
    });
  } catch (e) {
    if (e instanceof ShopifyAPIError) {
      console.error(`Revalidation Error: ${e.message}`, {
        code: e.code,
        statusCode: e.statusCode,
        source: e.source
      });

      return NextResponse.json({
        status: e.statusCode || 500,
        error: e.message
      });
    }

    console.error('Revalidation failed:', e);
    return NextResponse.json({
      status: 500,
      error: 'Internal Server Error'
    });
  }
}

// Helper function to safely handle API responses
export async function handleShopifyResponse<T>(
  operation: () => Promise<T>,
  errorContext: string
): Promise<T> {
  try {
    return await withRetry(operation, {
      ...DEFAULT_RETRY_OPTIONS,
      maxRetries: 3,
      backoffFactor: 2
    });
  } catch (e) {
    if (e instanceof ShopifyAPIError) {
      throw e;
    }

    throw new ShopifyAPIError(
      `Failed to execute ${errorContext}`,
      'OPERATION_ERROR',
      500,
      errorContext
    );
  }
}

// Utility function to validate Shopify webhook signatures
export function validateShopifyWebhook(body: string, headerHmac: string | null): boolean {
  if (!process.env.SHOPIFY_WEBHOOK_SECRET || !headerHmac) {
    return false;
  }

  try {
    const crypto = require('crypto');
    const hmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64');

    return hmac === headerHmac;
  } catch (e) {
    console.error('Webhook validation failed:', e);
    return false;
  }
}

// Export additional utility types and constants
export type { RetryOptions } from './retry';

export type { ShopifyAPIError, ShopifyError, ShopifyErrorResponse } from './errors';

export { DEFAULT_RETRY_OPTIONS, withRetry } from './retry';

export { globalRateLimiter } from './rate-limiter';

// Export webhook types for better type safety
export const WebhookTopics = {
  COLLECTIONS_CREATE: 'collections/create',
  COLLECTIONS_DELETE: 'collections/delete',
  COLLECTIONS_UPDATE: 'collections/update',
  PRODUCTS_CREATE: 'products/create',
  PRODUCTS_DELETE: 'products/delete',
  PRODUCTS_UPDATE: 'products/update'
} as const;

export type WebhookTopic = (typeof WebhookTopics)[keyof typeof WebhookTopics];
