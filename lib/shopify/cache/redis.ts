// File: /lib/shopify/cache/redis.ts

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class CacheManager {
  private redis: Redis;
  private prefix: string = 'shop:';
  private defaultTTL: number = 3600; // 1 hour

  constructor() {
    this.redis = redis;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(this.getKey(key));
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    await this.redis.setex(this.getKey(key), ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(this.getKey(key));
  }
}

export const cacheManager = new CacheManager();
