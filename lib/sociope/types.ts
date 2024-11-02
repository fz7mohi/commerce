// File: lib/sociope/types.ts
export interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Product {
  id: string;
  title: string;
  featuredImage?: {
    url: string;
    altText: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface Like {
  userId: string;
}

export interface SocialPost {
  id: string;
  content: string;
  images: string[];
  products: Product[];
  user: User;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface CreatePostData {
  content: string;
  images?: string[];
  productIds?: string[];
}
