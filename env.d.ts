// File: /env.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_URL: string;
      SHOPIFY_RATE_LIMIT_CONFIG: 'default' | 'aggressive' | 'relaxed';
    }
  }
}
