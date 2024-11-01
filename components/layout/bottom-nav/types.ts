// File: components/layout/bottom-nav/types.ts

import { LucideIcon } from 'lucide-react';

export interface TabItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  isDisabled?: boolean;
}
