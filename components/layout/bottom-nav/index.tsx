// File: components/layout/bottom-nav/index.tsx

'use client';

import { motion } from 'framer-motion';
import { Home, LayoutGrid, Sparkles, User, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { TabItem } from './tab-item';
import type { TabItem as TabItemType } from './types';

const tabs: TabItemType[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home
  },
  {
    name: 'Categories',
    href: '/search',
    icon: LayoutGrid
  },
  {
    name: 'SocioPe',
    href: '/sociope',
    icon: Sparkles,
    isDisabled: false
  },
  {
    name: 'Account',
    href: '/account',
    icon: User
  },
  {
    name: 'AiPe',
    href: '/aipe',
    icon: Zap,
    isDisabled: true
  }
];

const MotionDiv = motion.div;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <MotionDiv
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        marginLeft: '-1rem',
        marginRight: '-1rem',
        backdropFilter: 'blur(228px)'
      }}
      className="border-t border-neutral-200 bg-primary-gray/90 pb-[env(safe-area-inset-bottom)] dark:border-neutral-800 dark:bg-primary-dark/90 md:hidden"
    >
      <nav className="flex h-16">
        {tabs.map((tab) => (
          <TabItem
            key={tab.name}
            href={tab.href}
            icon={tab.icon}
            label={tab.name}
            isActive={pathname === tab.href}
            isDisabled={tab.isDisabled}
          />
        ))}
      </nav>
    </MotionDiv>
  );
}
