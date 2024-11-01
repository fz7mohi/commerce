// File: lib/shopify/rate-limiter/config.ts

export const RATE_LIMIT_CONFIG = {
  default: {
    requestsPerWindow: 60,
    windowMs: 60000,
    maxWaitingTime: 5000,
    queueTimeout: 10000
  },
  aggressive: {
    requestsPerWindow: 30,
    windowMs: 60000,
    maxWaitingTime: 8000,
    queueTimeout: 15000
  },
  relaxed: {
    requestsPerWindow: 120,
    windowMs: 60000,
    maxWaitingTime: 3000,
    queueTimeout: 8000
  }
} as const;

export type RateLimitConfigKey = keyof typeof RATE_LIMIT_CONFIG;
