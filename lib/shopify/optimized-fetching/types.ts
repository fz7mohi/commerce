// File: /lib/shopify/optimized-fetching/types.ts

export type RequestPriority = 'high' | 'medium' | 'low';

export interface FetchOptions {
  cache?: boolean;
  ttl?: number;
  priority?: RequestPriority;
  retries?: number;
}

export interface BatchedRequest {
  key: string;
  operation: () => Promise<any>;
  options: FetchOptions;
}

export const PRIORITY_VALUES: Record<RequestPriority, number> = {
  high: 3,
  medium: 2,
  low: 1
};
