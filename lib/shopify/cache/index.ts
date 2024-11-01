// File: /lib/shopify/cache/index.ts

export class MemoryCache {
  private cache: Map<string, { value: any; expires: number }> = new Map();
  private prefix: string = 'shop:';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const prefixedKey = this.getKey(key);
    const item = this.cache.get(prefixedKey);

    if (!item) return null;

    if (item.expires < Date.now()) {
      this.cache.delete(prefixedKey);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const prefixedKey = this.getKey(key);
    this.cache.set(prefixedKey, {
      value,
      expires: Date.now() + ttl * 1000
    });
  }

  async del(key: string): Promise<void> {
    const prefixedKey = this.getKey(key);
    this.cache.delete(prefixedKey);
  }
}

export const memoryCache = new MemoryCache();
