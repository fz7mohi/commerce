// components/collection-showcase/index.tsx

'use client';

import { addItem } from 'components/cart/actions';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from 'lib/shopify/types';
import { ChevronRight, Heart, Share2, ShoppingCart, Sparkles } from 'lucide-react';
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

const cardVariants = {
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => Promise<void>;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: `/product/${product.handle}`
      });
    } catch {
      navigator.clipboard.writeText(window.location.origin + `/product/${product.handle}`);
      toast.success('Link copied to clipboard');
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="initial"
      animate="animate"
      className="group relative flex w-[280px] flex-none snap-start flex-col md:w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white transition-shadow hover:shadow-xl dark:bg-neutral-900">
        {/* Image Container */}
        <div className="relative aspect-[3/4]">
          {product.featuredImage?.url && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 280px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

          {/* Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          {/* Quick Action Buttons - Top Right */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 dark:bg-black/90 ${
                isLiked ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950' : ''
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-blue-50 dark:bg-black/90 dark:hover:bg-blue-950"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Product Info Overlay - Always Visible */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Product Tag - If available */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" />
                  {product.tags[0]}
                </span>
              </div>
            )}

            {/* Title and Price */}
            <Link href={`/product/${product.handle}`} className="block">
              <h3 className="mb-1 text-lg font-semibold text-white">{product.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-white">
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
                </p>
                <p className="text-sm text-white/80">
                  {product.variants.length} {product.variants.length === 1 ? 'variant' : 'variants'}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-neutral-200 p-4 dark:border-neutral-800">
          <Link
            href={`/product/${product.handle}`}
            className="group/link flex items-center gap-2 text-sm font-medium"
          >
            View Details
            <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex h-10 items-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  const [activeCollection, setActiveCollection] = useState<string>('all');

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
      if (!product?.variants[0]) return;

      await addItem(null, product.variants[0].id);
      toast.success('Added to cart', {
        description: `${product.title} has been added to your cart.`
      });
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: 'Please try again later.'
      });
    }
  };

  return (
    <section className="relative pb-12 pt-8">
      {/* Collection Pills */}
      <div className="mb-8">
        <div className="mx-auto max-w-screen-2xl px-4">
          <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">Shop by Collection</h2>
          <div className="scrollbar-none flex gap-3 overflow-x-auto pb-4 md:pb-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCollection('all')}
              className={`flex-none rounded-full border-2 px-6 py-2.5 text-sm font-medium transition-colors ${
                activeCollection === 'all'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-neutral-200 bg-white hover:border-blue-600/50 dark:border-neutral-800 dark:bg-black dark:hover:border-blue-500/50'
              }`}
            >
              View All
            </motion.button>
            {collections.map((collection) => (
              <motion.button
                key={collection.handle}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCollection(collection.handle)}
                className={`flex-none rounded-full border-2 px-6 py-2.5 text-sm font-medium transition-colors ${
                  activeCollection === collection.handle
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-neutral-200 bg-white hover:border-blue-600/50 dark:border-neutral-800 dark:bg-black dark:hover:border-blue-500/50'
                }`}
              >
                {collection.title}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="wait">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="mt-4 flex justify-center gap-1 md:hidden">
        <div className="h-1 w-10 rounded-full bg-blue-600" />
        <div className="h-1 w-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-1 w-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </section>
  );
}

export default CollectionShowcase;
