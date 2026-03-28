'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { LoginInput } from '@/types/user';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});

  const validate = (): boolean => {
    const errs: Partial<LoginInput> = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    const success = await login(form);
    if (success) router.push('/products');
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex rounded-full bg-indigo-50 p-3">
              <Package2 className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to your MiniStore account</p>
          </div>

          {searchParams.get('reset') === '1' && (
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Password updated successfully. Sign in with your new password.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                required
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 hover:text-indigo-600"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" isLoading={isLoading} className="mt-1 w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Demo accounts:</p>
            <p>Admin: admin@ministore.com / admin123</p>
            <p>Customer: customer@ministore.com / customer123</p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
