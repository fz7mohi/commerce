// File: components/ui/input.tsx
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm',
          'ring-offset-white placeholder:text-primary-dark/60',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-primary-dark/20 dark:bg-primary-dark dark:ring-offset-primary-dark',
          'dark:placeholder:text-primary-gray/60',
          'dark:focus-visible:ring-primary-light',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
