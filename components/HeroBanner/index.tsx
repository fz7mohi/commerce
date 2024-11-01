// components/HeroBanner/index.tsx
import Image from 'next/image';
import { HeroBannerContent } from './hero-banner-content';
import { ScrollIndicator } from './scroll-indicator';

export function HeroBanner() {
  return (
    <div className="relative flex flex-col lg:h-screen lg:flex-row">
      {/* Mobile Nav Dots */}
      <div className="fixed right-4 top-1/2 z-20 -translate-y-1/2 lg:hidden">
        <div className="flex flex-col gap-2">
          <div className="h-2 w-2 rounded-full bg-white/80" />
          <div className="h-2 w-2 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Men's Section */}
      <div className="relative h-[60vh] overflow-hidden lg:h-full lg:w-1/2">
        <div className="absolute inset-0">
          <Image
            src="/images/banner/mens-banner.jpg"
            alt="Men's Collection"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <HeroBannerContent
          section="men"
          title="MEN"
          description="Discover our latest men's collection featuring contemporary designs and premium materials"
          categories={['Suits', 'Casual', 'Accessories', 'Shoes']}
          featuredProduct={{
            name: 'Premium Wool Suit',
            price: '$599',
            image: '/images/products/mens-suit.jpg'
          }}
        />
      </div>

      {/* Women's Section */}
      <div className="relative h-[60vh] overflow-hidden lg:h-full lg:w-1/2">
        <div className="absolute inset-0">
          <Image
            src="/images/banner/womens-banner.jpg"
            alt="Women's Collection"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <HeroBannerContent
          section="women"
          title="WOMEN"
          description="Explore our women's collection featuring elegant designs and seasonal essentials"
          categories={['Dresses', 'Casual', 'Accessories', 'Bags']}
          featuredProduct={{
            name: 'Silk Evening Dress',
            price: '$399',
            image: '/images/products/womens-dress.jpg'
          }}
        />
      </div>

      {/* Scroll Indicator - Only on Desktop */}
      <div className="hidden lg:block">
        <ScrollIndicator />
      </div>
    </div>
  );
}
