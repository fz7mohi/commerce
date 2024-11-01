// File: lib/shopify/rate-limiter/advanced-limiter.ts

import { RATE_LIMIT_CONFIG } from './config'; // Fixed import path

export class AdvancedRateLimiter {
  private requests: number[] = [];
  private queue: Array<{
    resolve: () => void;
    reject: (err: Error) => void;
    priority: number;
    timestamp: number;
  }> = [];
  private processing: boolean = false;
  private config;

  constructor(configType?: keyof typeof RATE_LIMIT_CONFIG) {
    this.config = RATE_LIMIT_CONFIG[configType || 'default'];
  }

  private cleanup() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.config.windowMs);
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      this.cleanup();

      if (this.requests.length < this.config.requestsPerWindow) {
        const nextRequest = this.queue.shift();
        if (nextRequest) {
          this.requests.push(Date.now());
          nextRequest.resolve();
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } else {
        break;
      }
    }

    this.processing = false;
  }

  async acquireToken(priority: number = 1): Promise<void> {
    this.cleanup();

    if (this.requests.length < this.config.requestsPerWindow) {
      this.requests.push(Date.now());
      return;
    }

    return new Promise((resolve, reject) => {
      const now = Date.now();
      const timeout = setTimeout(() => {
        const index = this.queue.findIndex((item) => item.resolve === resolve);
        if (index !== -1) {
          this.queue.splice(index, 1);
          reject(new Error('Rate limit queue timeout'));
        }
      }, this.config.queueTimeout);

      this.queue.push({
        resolve: () => {
          clearTimeout(timeout);
          resolve();
        },
        reject: (err: Error) => {
          clearTimeout(timeout);
          reject(err);
        },
        priority,
        timestamp: now // Added timestamp
      });

      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }

  releaseToken() {
    setTimeout(() => this.processQueue(), 0);
  }

  getMetrics() {
    return {
      queueLength: this.queue.length,
      currentRequests: this.requests.length,
      isProcessing: this.processing,
      config: this.config
    };
  }
}
