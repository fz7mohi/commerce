// File: /lib/shopify/rate-limiter/config.ts

import { RateLimitConfig } from './types';

export const rateLimitConfigs: Record<string, RateLimitConfig> = {
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
