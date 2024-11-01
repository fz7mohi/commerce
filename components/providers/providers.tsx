// components/providers/providers.tsx

'use client';

import { SessionProvider } from 'next-auth/react';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function Providers({ children, ...themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider {...themeProps}>{children}</ThemeProvider>
    </SessionProvider>
  );
}
