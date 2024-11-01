// components/HeroBanner/hero-banner-buttons.tsx
'use client';

import { ArrowRight } from 'lucide-react';

export function HeroBannerButtons() {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <button
        onClick={() => {
          console.log('Primary button clicked');
          // Add your navigation or action logic here
        }}
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        View Collection
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
      <button
        onClick={() => {
          console.log('Secondary button clicked');
          // Add your navigation or action logic here
        }}
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        View Lookbook
      </button>
    </div>
  );
}
