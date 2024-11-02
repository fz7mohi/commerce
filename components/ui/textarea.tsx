// components/ui/textarea.tsx
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const textareaVariants = cva(
  [
    // Base styles
    'w-full min-h-[80px] rounded-lg transition-all duration-200',
    'text-sm leading-relaxed resize-none',

    // Background and backdrop effects
    'bg-white/80 dark:bg-neutral-900/80',
    'backdrop-blur-md backdrop-saturate-150',

    // Border styles
    'border border-neutral-200/80 dark:border-neutral-800/80',
    'hover:border-primary/30 dark:hover:border-primary-light/30',

    // Ring styles
    'ring-offset-white dark:ring-offset-neutral-900',
    'focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-light/20',
    'focus:ring-offset-2 focus:border-primary dark:focus:border-primary-light',

    // Placeholder styles
    'placeholder:text-neutral-500/60 dark:placeholder:text-neutral-400/60',

    // Padding and scrollbar styles
    'px-4 py-3',
    'scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700',
    'scrollbar-track-transparent'
  ],
  {
    variants: {
      variant: {
        default: '',
        error: [
          'border-red-500/50 dark:border-red-500/50',
          'focus:border-red-500 dark:focus:border-red-500',
          'focus:ring-red-500/20 dark:focus:ring-red-500/20',
          'text-red-600 dark:text-red-500',
          'placeholder:text-red-500/60 dark:placeholder:text-red-500/60'
        ],
        success: [
          'border-green-500/50 dark:border-green-500/50',
          'focus:border-green-500 dark:focus:border-green-500',
          'focus:ring-green-500/20 dark:focus:ring-green-500/20'
        ]
      },
      size: {
        default: 'min-h-[80px]',
        sm: 'min-h-[60px] text-xs',
        lg: 'min-h-[120px]',
        xl: 'min-h-[160px]'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      label,
      error,
      helperText,
      maxLength,
      showCount,
      value = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(String(value).length);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    // Auto-resize functionality
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener('input', adjustHeight);
      adjustHeight(); // Initial adjustment

      return () => textarea.removeEventListener('input', adjustHeight);
    }, []);

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={(element) => {
              // Handle both refs
              if (typeof ref === 'function') {
                ref(element);
              } else if (ref) {
                ref.current = element;
              }
              if (textareaRef) {
                textareaRef.current = element;
              }
            }}
            className={cn(textareaVariants({ variant, size, className }))}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />

          {maxLength && showCount && (
            <div className="pointer-events-none absolute bottom-2 right-2">
              <span className="text-xs text-neutral-400">
                {charCount}/{maxLength}
              </span>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-1.5 text-xs">
            {error && <span className="text-red-500">{error}</span>}
            {helperText && !error && (
              <span className="text-neutral-500 dark:text-neutral-400">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
