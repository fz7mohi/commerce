// File: components/providers/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface ProvidersProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function Providers({ children, ...themeProps }: ProvidersProps) {
  return <ThemeProvider {...themeProps}>{children}</ThemeProvider>;
}
