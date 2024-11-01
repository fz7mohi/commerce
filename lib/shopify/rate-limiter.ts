// File: /lib/shopify/rate-limiter.ts

export const RATE_LIMIT_REQUESTS = 50; // Adjust based on your Shopify plan
export const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

export class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < RATE_LIMIT_WINDOW);
    return this.requests.length < RATE_LIMIT_REQUESTS;
  }

  addRequest(): void {
    this.requests.push(Date.now());
  }
}

export const globalRateLimiter = new RateLimiter();
