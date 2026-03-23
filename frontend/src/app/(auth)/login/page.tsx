'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { login } from '@/lib/api/auth';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      router.push('/home');
    } catch {
      toast.error('Invalid email or password');
    }
  };

  const handleOAuth = (_provider: string) => {
    toast.error('OAuth requires backend configuration. Use email/password for local testing.');
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-white/60">Sign in to your KnowledgeForge account</p>
      </div>

      {/* OAuth buttons */}
      <div className="mb-6 space-y-3">
        <Button
          className="w-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
          size="lg"
          variant="ghost"
          onClick={() => handleOAuth('google')}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
        <Button
          className="w-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
          size="lg"
          variant="ghost"
          onClick={() => handleOAuth('azure-ad')}
        >
          <svg className="h-4 w-4" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1h10v10H1z" fill="#f25022" />
            <path d="M12 1h10v10H12z" fill="#7fba00" />
            <path d="M1 12h10v10H1z" fill="#00a4ef" />
            <path d="M12 12h10v10H12z" fill="#ffb900" />
          </svg>
          Continue with Microsoft
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-transparent px-2 text-white/40">or continue with email</span>
        </div>
      </div>

      {/* Credentials form */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
            placeholder="you@company.com"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-white/80" htmlFor="password">
              Password
            </label>
            <Link
              className="text-xs text-brand-400 hover:text-brand-300"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
            placeholder="••••••••"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <Button className="w-full" loading={isSubmitting} size="lg" type="submit">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Don&apos;t have an account?{' '}
        <Link className="font-medium text-brand-400 hover:text-brand-300" href="/register">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
