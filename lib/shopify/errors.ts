// File: /lib/shopify/errors.ts

export interface ShopifyError extends Error {
  code: string;
  statusCode?: number;
  source?: string;
}

export interface ShopifyErrorResponse {
  errors: {
    message: string;
    code?: string;
    fields?: string[];
  }[];
}

export class ShopifyAPIError extends Error implements ShopifyError {
  code: string;
  statusCode?: number;
  source?: string;

  constructor(message: string, code: string, statusCode?: number, source?: string) {
    super(message);
    this.name = 'ShopifyAPIError';
    this.code = code;
    this.statusCode = statusCode;
    this.source = source;
  }
}
