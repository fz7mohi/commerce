// components/collection-showcase/loader.ts

import { getCollectionProducts, getCollections } from 'lib/shopify';
import { Product } from 'lib/shopify/types';

export interface LoadedCollection {
  title: string;
  handle: string;
  products: Product[];
}

export async function loadCollectionData(): Promise<LoadedCollection[]> {
  try {
    // Get all collections using the Shopify function
    const collections = await getCollections();

    // Filter out hidden collections and the 'All' collection
    const visibleCollections = collections.filter(
      (collection) =>
        collection.handle && !collection.handle.startsWith('hidden') && collection.handle !== 'all'
    );

    // Fetch products for each collection
    const collectionsWithProducts = await Promise.all(
      visibleCollections.map(async (collection) => {
        const products = await getCollectionProducts({
          collection: collection.handle,
          sortKey: 'BEST_SELLING'
        });

        return {
          title: collection.title,
          handle: collection.handle,
          products: products
        };
      })
    );

    return collectionsWithProducts;
  } catch (error) {
    console.error('Error loading collection data:', error);
    return [];
  }
}
