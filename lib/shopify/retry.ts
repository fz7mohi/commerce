import { ShopifyAPIError } from './errors';

export interface RetryOptions {
  maxRetries: number;
  backoffFactor: number;
  initialDelay: number;
  maxDelay: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  backoffFactor: 2,
  initialDelay: 1000,
  maxDelay: 10000
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = retryOptions.initialDelay;

  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (error instanceof ShopifyAPIError) {
        // Don't retry client errors (4xx)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }
      }

      if (attempt === retryOptions.maxRetries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      delay = Math.min(delay * retryOptions.backoffFactor, retryOptions.maxDelay);
    }
  }

  throw lastError || new Error('Operation failed after retries');
}
