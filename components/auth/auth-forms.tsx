import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Link } from '@nextui-org/react';
import { AlertCircle, CheckCircle2, Info, Loader2, Lock, Mail, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Schema definitions remain the same
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

// Common styles object for inputs
const inputStyles = {
  base: 'py-0 my-2',
  label: 'text-sm font-medium text-neutral-700 dark:text-neutral-300 pb-1.5',
  mainWrapper: [
    'h-12',
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    'hover:border-neutral-400 dark:hover:border-neutral-600',
    'data-[focused=true]:border-primary-500 dark:data-[focused=true]:border-primary-400',
    'rounded-lg',
    'transition-colors'
  ].join(' '),
  innerWrapper: 'bg-transparent',
  input: [
    'text-base',
    'text-neutral-900 dark:text-neutral-100',
    'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
    'font-normal'
  ].join(' '),
  inputWrapper: 'h-full shadow-none bg-transparent',
  errorMessage: 'text-xs font-medium text-danger-500 mt-1'
};

interface AuthFormProps {
  onClose: () => void;
}

export function SignInForm({ onClose }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange'
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    setGeneralError(null);

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      });

      if (result?.error) {
        setGeneralError('Invalid email or password');
        return;
      }

      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
      setGeneralError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 px-1">
      {generalError && (
        <div className="bg-danger-50/50 text-danger-600 dark:bg-danger-900/20 dark:text-danger-400 flex items-center gap-2 rounded-lg p-4 text-sm backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="mb-6 flex w-full flex-wrap gap-4 md:mb-0 md:flex-nowrap">
          <Input
            {...register('email')}
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            description="We'll never share your email with anyone else."
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            classNames={inputStyles}
            variant="bordered"
          />

          <Input
            {...register('password')}
            type="password"
            label="Password"
            labelPlacement="outside"
            defaultValue="junior@nextui.org"
            startContent={<Lock className="text-default-400 h-4 w-4" />}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            classNames={inputStyles}
            variant="bordered"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-primary hover:opacity-80"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        spinner={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        className="hover:bg-primary-500 h-12 bg-primary font-medium tracking-wide shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30"
        fullWidth
      >
        Sign In
      </Button>
    </form>
  );
}

export function RegisterForm({ onClose }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const password = watch('password');
  const passwordRequirements = [
    { label: 'At least 6 characters', valid: password?.length >= 6 },
    { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password || '') },
    { label: 'Contains number', valid: /[0-9]/.test(password || '') }
  ];

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setGeneralError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      });

      onClose();
    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 px-1">
      {generalError && (
        <div className="bg-danger-50/50 text-danger-600 dark:bg-danger-900/20 dark:text-danger-400 flex items-center gap-2 rounded-lg p-4 text-sm backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Input
          {...register('name')}
          type="text"
          label="Name"
          labelPlacement="outside"
          placeholder="Enter your name"
          startContent={<User className="text-default-400 h-4 w-4" />}
          errorMessage={errors.name?.message}
          isInvalid={!!errors.name}
          classNames={inputStyles}
          variant="bordered"
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          startContent={<Mail className="text-default-400 h-4 w-4" />}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          classNames={inputStyles}
          variant="bordered"
        />

        <div className="space-y-3">
          <Input
            {...register('password')}
            type="password"
            label="Password"
            labelPlacement="outside"
            placeholder="Create a password"
            startContent={<Lock className="text-default-400 h-4 w-4" />}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            classNames={inputStyles}
            variant="bordered"
          />

          <div className="border-default-200/50 bg-default-100/50 dark:border-default-800/50 dark:bg-default-900/50 space-y-2 rounded-lg border p-4 backdrop-blur-sm">
            <div className="text-default-700 dark:text-default-300 text-xs font-medium">
              Password Requirements:
            </div>
            <div className="grid gap-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {req.valid ? (
                    <CheckCircle2 className="text-success h-3.5 w-3.5" />
                  ) : (
                    <Info className="text-default-400 h-3.5 w-3.5" />
                  )}
                  <span className={req.valid ? 'text-success' : 'text-default-500'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          labelPlacement="outside"
          placeholder="Confirm your password"
          startContent={<Lock className="text-default-400 h-4 w-4" />}
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword}
          classNames={inputStyles}
          variant="bordered"
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        spinner={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        className="hover:bg-primary-500 h-12 bg-primary font-medium tracking-wide shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30"
        fullWidth
      >
        Create Account
      </Button>
    </form>
  );
}
