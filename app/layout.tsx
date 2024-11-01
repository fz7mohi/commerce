import { CartProvider } from 'components/cart/cart-context';
import { BottomNav } from 'components/layout/bottom-nav'; // Add this import
import { Navbar } from 'components/layout/navbar';
import { Providers } from 'components/providers/providers';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
import { ensureStartsWith } from 'lib/utils';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  const cart = getCart(cartId);

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-primary-gray text-primary-dark transition-colors duration-300 selection:bg-primary selection:text-primary-white dark:bg-primary-dark dark:text-primary-gray dark:selection:bg-primary-light dark:selection:text-primary-dark">
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main className="pb-16 md:pb-0">
            {' '}
            {/* Add padding bottom for mobile */}
            <Providers
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </Providers>
            <Toaster
              closeButton
              theme="system"
              toastOptions={{
                className:
                  '!bg-primary-gray !text-primary-dark dark:!bg-primary-dark dark:!text-primary-gray',
                style: {
                  border: '1px solid var(--primary-default)'
                }
              }}
            />
            <WelcomeToast />
          </main>
          <BottomNav /> {/* Add the BottomNav component */}
        </CartProvider>
      </body>
    </html>
  );
}
