// components/collection-showcase/index.tsx

'use client';

import { addItem } from 'components/cart/actions';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from 'lib/shopify/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface CollectionShowcaseProps {
  collections: Array<{
    title: string;
    handle: string;
    products: Product[];
  }>;
}

export function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  const [activeCollection, setActiveCollection] = useState<string>('all');

  // Get all unique products across collections
  const allProducts = Array.from(
    new Set(collections.flatMap((collection) => collection.products.map((product) => product.id)))
  )
    .map((productId) =>
      collections
        .flatMap((collection) => collection.products)
        .find((product) => product.id === productId)
    )
    .filter((product): product is Product => !!product);

  const displayProducts =
    activeCollection === 'all'
      ? allProducts
      : collections.find((c) => c.handle === activeCollection)?.products || [];

  const handleAddToCart = async (productId: string) => {
    try {
      const product = displayProducts.find((p) => p.id === productId);
      if (!product) return;

      const defaultVariant = product.variants[0];
      if (!defaultVariant) {
        toast.error('No available variants');
        return;
      }

      await addItem(null, defaultVariant.id);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  return (
    <section className="py-8">
      {/* Collections Filter Pills */}
      <div className="mb-6 px-4">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Shop by Collection</h2>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-4">
          <button
            onClick={() => setActiveCollection('all')}
            className={`flex-none rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCollection === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            All Products
          </button>
          {collections.map((collection) => (
            <button
              key={collection.handle}
              onClick={() => setActiveCollection(collection.handle)}
              className={`flex-none rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCollection === collection.handle
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {collection.title}
            </button>
          ))}
        </div>
      </div>

      {/* Products Scroll Section */}
      <div className="relative">
        <div className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6">
          <AnimatePresence mode="wait">
            {displayProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="w-[200px] rounded-xl border border-neutral-200 bg-white p-2 sm:w-[250px] dark:border-neutral-800 dark:bg-black">
                  <Link href={`/product/${product.handle}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                      {product.featuredImage?.url && (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          sizes="(min-width: 640px) 250px, 200px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="mt-3 px-1">
                    <Link
                      href={`/product/${product.handle}`}
                      className="block text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {product.title}
                    </Link>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: product.priceRange.minVariantPrice.currencyCode,
                          minimumFractionDigits: 0
                        }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
                        aria-label={`Add ${product.title} to cart`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default CollectionShowcase;
