// File: components/ui/button.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-primary-light',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary/90 dark:bg-primary-light dark:text-primary-dark dark:hover:bg-primary-light/90',
        destructive:
          'bg-red-500 text-white hover:bg-red-500/90 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90',
        outline:
          'border border-primary/20 bg-white hover:bg-primary/5 hover:text-primary dark:border-primary-dark/20 dark:bg-primary-dark dark:hover:bg-primary-light/10 dark:hover:text-primary-light',
        secondary:
          'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary-light/10 dark:text-primary-light dark:hover:bg-primary-light/20',
        ghost:
          'hover:bg-primary/5 hover:text-primary dark:hover:bg-primary-light/10 dark:hover:text-primary-light',
        link: 'text-primary underline-offset-4 hover:underline dark:text-primary-light'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
