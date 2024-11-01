// components/collection-showcase/loader.ts

import { getCollectionProducts, getCollections } from 'lib/shopify';
import { Product } from 'lib/shopify/types';

export interface LoadedCollection {
  title: string;
  handle: string;
  description: string;
  products: Product[];
  seo: {
    title: string;
    description: string;
  };
}

export async function loadCollectionData(): Promise<LoadedCollection[]> {
  try {
    // Get all collections
    const collections = await getCollections();

    // Filter out hidden collections and the 'All' collection
    const visibleCollections = collections.filter(
      (collection) => collection.handle && !collection.handle.startsWith('hidden')
    );

    // Fetch products for each collection with additional sorting and filtering
    const collectionsWithProducts = await Promise.all(
      visibleCollections.map(async (collection) => {
        const products = await getCollectionProducts({
          collection: collection.handle,
          sortKey: 'BEST_SELLING'
        });

        // Filter out products without images or out of stock
        const filteredProducts = products.filter(
          (product) => product.featuredImage && product.availableForSale
        );

        return {
          title: collection.title,
          handle: collection.handle,
          description: collection.description,
          products: filteredProducts,
          seo: collection.seo
        };
      })
    );

    // Sort collections by product count
    return collectionsWithProducts.sort((a, b) => b.products.length - a.products.length);
  } catch (error) {
    console.error('Error loading collection data:', error);
    return [];
  }
}
