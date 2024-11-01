// components/HeroBanner/types.ts
import { type Product } from 'lib/shopify/types';

export interface HeroCollection {
  handle: string;
  title: string;
  description: string;
  products: Product[];
}

export interface HeroBannerContentProps {
  section: 'men' | 'women';
  collection: HeroCollection;
  featuredProduct?: Product;
}
