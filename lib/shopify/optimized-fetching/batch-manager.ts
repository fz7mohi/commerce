// File: /lib/shopify/optimized-fetching/batch-manager.ts

import { memoryCache } from '../cache';
import { AdvancedRateLimiter } from '../rate-limiter/advanced-limiter';
import { BatchedRequest, FetchOptions, PRIORITY_VALUES, RequestPriority } from './types';

export class BatchManager {
  private batchWindow: number = 50;
  private currentBatch: BatchedRequest[] = [];
  private batchPromise: Promise<any> | null = null;
  private rateLimiter: AdvancedRateLimiter;

  constructor() {
    this.rateLimiter = new AdvancedRateLimiter();
  }

  private getPriorityValue(priority: RequestPriority | undefined): number {
    return priority ? PRIORITY_VALUES[priority] : PRIORITY_VALUES.medium;
  }

  private async executeBatch(requests: BatchedRequest[]): Promise<Map<string, any>> {
    const results = new Map();

    const sortedRequests = requests.sort((a, b) => {
      const priorityA = this.getPriorityValue(a.options.priority);
      const priorityB = this.getPriorityValue(b.options.priority);
      return priorityB - priorityA;
    });

    for (const request of sortedRequests) {
      try {
        const priority = this.getPriorityValue(request.options.priority);
        await this.rateLimiter.acquireToken(priority);

        if (request.options.cache) {
          const cached = await memoryCache.get(request.key);
          if (cached) {
            results.set(request.key, cached);
            continue;
          }
        }

        const result = await this.executeWithRetries(request);

        if (request.options.cache) {
          await memoryCache.set(request.key, result, request.options.ttl);
        }

        results.set(request.key, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.set(request.key, { error: errorMessage });
      } finally {
        this.rateLimiter.releaseToken();
      }
    }

    return results;
  }

  private async executeWithRetries(request: BatchedRequest, attempt: number = 1): Promise<any> {
    try {
      return await request.operation();
    } catch (error) {
      if (attempt < (request.options.retries || 3)) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.executeWithRetries(request, attempt + 1);
      }
      throw error;
    }
  }

  async add<T>(key: string, operation: () => Promise<T>, options: FetchOptions = {}): Promise<T> {
    const request: BatchedRequest = {
      key,
      operation,
      options: {
        cache: true,
        ttl: 3600,
        priority: 'medium',
        retries: 3,
        ...options
      }
    };

    if (!this.batchPromise) {
      this.currentBatch = [];
      this.batchPromise = new Promise((resolve) => {
        setTimeout(async () => {
          const batch = this.currentBatch;
          this.currentBatch = [];
          this.batchPromise = null;
          resolve(await this.executeBatch(batch));
        }, this.batchWindow);
      });
    }

    this.currentBatch.push(request);
    const results = await this.batchPromise;
    const result = results.get(key);

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  }
}
