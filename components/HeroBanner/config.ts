// components/HeroBanner/config.ts
export const BANNER_IMAGES = {
  men: {
    url: '/images/banner/mens-banner.jpg',
    alt: "Men's Collection - Modern fashion for men",
    blurUrl: 'data:image/jpeg;base64,...' // Optional blur data URL
  },
  women: {
    url: '/images/banner/womens-banner.jpg',
    alt: "Women's Collection - Contemporary fashion for women",
    blurUrl: 'data:image/jpeg;base64,...' // Optional blur data URL
  }
} as const;
