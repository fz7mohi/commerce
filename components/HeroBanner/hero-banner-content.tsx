'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface HeroBannerContentProps {
  section: 'men' | 'women';
  title: string;
  description: string;
  categories: string[];
  featuredProduct: {
    name: string;
    price: string;
    image: string;
  };
}

// Define motion components with proper HTML element types
const MotionH2 = motion.h2;
const MotionP = motion.p;
const MotionDiv = motion.div;
const MotionButton = motion.button;

export function HeroBannerContent({
  section,
  title,
  description,
  categories,
  featuredProduct
}: HeroBannerContentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center p-4 text-white sm:p-6 lg:p-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-4 top-4 lg:hidden">
        <span className="text-xs text-white/60">Swipe to explore</span>
      </div>

      <MotionH2
        className="mb-2 text-4xl font-bold tracking-tight sm:mb-4 sm:text-5xl lg:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </MotionH2>

      <MotionP
        className="mb-4 max-w-[280px] text-center text-base opacity-90 sm:mb-6 sm:max-w-md sm:text-lg lg:mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {description}
      </MotionP>

      {/* Desktop Categories */}
      <div
        className={`mb-8 hidden space-y-4 transition-opacity duration-500 lg:block ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {categories.map((category) => (
          <div key={category} className="cursor-pointer text-xl font-light hover:font-normal">
            {category}
          </div>
        ))}
      </div>

      {/* Mobile Categories Panel */}
      <div className="mb-4 w-full max-w-sm lg:hidden">
        <button
          onClick={() => setShowMobileCategories(!showMobileCategories)}
          className="flex w-full items-center justify-between rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm"
        >
          <span>Browse Categories</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${
              showMobileCategories ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {showMobileCategories && (
            <MotionDiv
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="rounded-lg bg-white/20 px-3 py-2 text-center text-sm backdrop-blur-sm"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Product - Mobile */}
      <MotionDiv
        className="mb-6 w-full max-w-sm overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm lg:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative h-40">
          <Image
            src={featuredProduct.image}
            alt={featuredProduct.name}
            fill
            className="object-cover"
          />
          <button
            className="absolute right-2 top-2 rounded-full bg-white/20 p-2 backdrop-blur-sm"
            onClick={() => {
              /* Add to wishlist */
            }}
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-medium">{featuredProduct.name}</h3>
          <p className="text-white/80">{featuredProduct.price}</p>
        </div>
      </MotionDiv>

      {/* CTA Button */}
      <MotionButton
        className="group/btn flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black transition-colors duration-300 hover:bg-black hover:text-white sm:px-8 sm:py-4 sm:text-base"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.98 }}
      >
        Shop {section === 'men' ? "Men's" : "Women's"}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 sm:h-5 sm:w-5" />
      </MotionButton>
    </div>
  );
}
