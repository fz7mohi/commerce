// File: components/providers/nextui-provider.tsx
'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export function NextUIClientProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}
