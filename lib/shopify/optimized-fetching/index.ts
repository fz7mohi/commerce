// File: lib/shopify/optimized-fetching/index.ts

import { getCollections, getProduct, getProductRecommendations } from '../index';
import { BatchManager } from './batch-manager';
import { FetchOptions } from './types';

export class OptimizedShopifyClient {
  private batchManager: BatchManager;

  constructor() {
    this.batchManager = new BatchManager();
  }

  async getProductPageData(handle: string, options: FetchOptions = {}) {
    try {
      // First, get the product to have access to its ID
      const product = await this.batchManager.add(`product:${handle}`, () => getProduct(handle), {
        ...options,
        priority: 'high'
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Then fetch recommendations and collections in parallel
      const [recommendations, collections] = await Promise.all([
        this.batchManager.add(
          `recommendations:${product.id}`,
          () => getProductRecommendations(product.id),
          {
            ...options,
            priority: 'medium'
          }
        ),
        this.batchManager.add('collections', () => getCollections(), {
          ...options,
          priority: 'low'
        })
      ]);

      return {
        product,
        recommendations,
        collections
      };
    } catch (error) {
      console.error('Error fetching product page data:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load product data');
    }
  }
}

export const shopifyClient = new OptimizedShopifyClient();
