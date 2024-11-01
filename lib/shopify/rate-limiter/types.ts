// File: /lib/shopify/rate-limiter/types.ts

export type RateLimitMode = 'development' | 'production';

export interface RateLimitConfig {
  requestsPerWindow: number;
  windowMs: number;
  maxWaitingTime: number;
  queueTimeout: number;
}

export const rateLimitConfigs: Record<RateLimitMode, RateLimitConfig> = {
  development: {
    requestsPerWindow: 100,
    windowMs: 1000,
    maxWaitingTime: 10000,
    queueTimeout: 15000
  },
  production: {
    requestsPerWindow: 50,
    windowMs: 60000,
    maxWaitingTime: 5000,
    queueTimeout: 10000
  }
};
