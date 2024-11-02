// File: components/layout/navbar/index.tsx
import { UserMenu } from '@/components/auth/user-menu';
import CartModal from 'components/cart/modal';
import LogoHorizontal from 'components/logo-horizontal';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav className="relative flex items-center justify-between bg-primary-dark shadow-md">
      <div className="flex w-full flex-col">
        {/* Upper Nav Section - Optional Announcement or Secondary Nav */}
        <div className="hidden w-full bg-primary/90 px-6 py-1 text-center text-sm text-primary-white md:block">
          Free shipping on orders over $50
        </div>

        {/* Main Nav Section */}
        <div className="flex w-full items-center p-4 lg:px-6">
          {/* Mobile Menu Button */}
          <div className="block flex-none md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>

          {/* Logo and Menu Items */}
          <div className="flex w-full items-center">
            <div className="flex w-full md:w-1/3">
              <Link
                href="/"
                prefetch={true}
                className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
              >
                <div className="ml-2 flex-none text-sm font-medium uppercase text-primary-white md:hidden lg:block">
                  <LogoHorizontal />
                </div>
              </Link>

              {menu.length ? (
                <ul className="hidden gap-6 text-sm md:flex md:items-center">
                  {menu.map((item: Menu) => (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        prefetch={true}
                        className="text-primary-gray transition-colors duration-200 hover:text-primary-light hover:underline hover:underline-offset-4 dark:text-primary-gray/90 dark:hover:text-primary-light"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Search Bar */}
            <div className="hidden justify-center md:flex md:w-1/3">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>

            {/* Cart */}
            <div className="flex justify-end md:w-1/3">
              <CartModal />
              <div className="border-l border-primary-gray/20 pl-4">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
