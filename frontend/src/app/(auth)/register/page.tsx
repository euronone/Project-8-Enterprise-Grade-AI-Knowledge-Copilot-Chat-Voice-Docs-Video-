'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import * as authApi from '@/lib/api/auth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
    organizationName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      }, inviteToken ?? undefined);
      toast.success('Account created! Welcome to KnowledgeForge.');
      router.push('/home');
    } catch {
      toast.error('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        {inviteToken ? (
          <p className="mt-2 text-sm text-emerald-300">You were invited to join KnowledgeForge</p>
        ) : (
          <p className="mt-2 text-sm text-white/60">Start for free, no credit card required</p>
        )}
      </div>
      {inviteToken && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Invite link detected — your account will be created with the pre-assigned role.
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Full name</label>
          <input
            autoComplete="name"
            className={fieldClass}
            placeholder="Jane Smith"
            type="text"
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Work email</label>
          <input
            autoComplete="email"
            className={fieldClass}
            placeholder="you@company.com"
            type="email"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">
            Organization (optional)
          </label>
          <input
            className={fieldClass}
            placeholder="Acme Corp"
            type="text"
            {...register('organizationName')}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Password</label>
          <input
            autoComplete="new-password"
            className={fieldClass}
            placeholder="8+ characters, 1 uppercase, 1 number"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">
            Confirm password
          </label>
          <input
            autoComplete="new-password"
            className={fieldClass}
            placeholder="Re-enter your password"
            type="password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <p className="text-xs text-white/40">
          By creating an account, you agree to our{' '}
          <a className="text-brand-400 hover:text-brand-300" href="#">
            Terms of Service
          </a>{' '}
          and{' '}
          <a className="text-brand-400 hover:text-brand-300" href="#">
            Privacy Policy
          </a>
          .
        </p>

        <Button className="w-full" loading={isSubmitting} size="lg" type="submit">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{' '}
        <Link className="font-medium text-brand-400 hover:text-brand-300" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
