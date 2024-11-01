// File: components/layout/bottom-nav/tab-item.tsx

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface TabItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  badge?: number;
  isDisabled?: boolean;
}

const MotionDiv = motion.div;

export function TabItem({ href, icon: Icon, label, isActive, badge, isDisabled }: TabItemProps) {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <Icon
          className={clsx(
            'h-6 w-6',
            isActive
              ? 'text-primary dark:text-primary-light'
              : 'text-primary-dark/60 dark:text-primary-gray/60'
          )}
        />
        {badge ? (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-medium text-white">
            {badge}
          </span>
        ) : null}
      </div>
      <span
        className={clsx(
          'mt-1 text-[10px]',
          isActive
            ? 'font-medium text-primary dark:text-primary-light'
            : 'text-primary-dark/60 dark:text-primary-gray/60'
        )}
      >
        {label}
      </span>
      {isActive && (
        <MotionDiv
          layoutId="bottomNavIndicator"
          className="absolute -top-[2px] h-1 w-12 rounded-full bg-primary dark:bg-primary-light"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </div>
  );

  if (isDisabled) {
    return (
      <div className="relative flex flex-1 cursor-not-allowed items-center justify-center py-2 opacity-50">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="relative flex flex-1 items-center justify-center py-2 active:opacity-70"
    >
      {content}
    </Link>
  );
}
