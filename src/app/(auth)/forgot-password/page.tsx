'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Step = 'email' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email) return setEmailError('Email is required');
    if (!/\S+@\S+\.\S+/.test(email)) return setEmailError('Invalid email');
    setEmailError('');
    setStep('reset');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let valid = true;
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('At least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!confirm) {
      setConfirmError('Please confirm your password');
      valid = false;
    } else if (password !== confirm) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else {
      setConfirmError('');
    }

    if (!valid) return;

    const success = await resetPassword(email, password);
    if (success) router.push('/login?reset=1');
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex rounded-full bg-indigo-50 p-3">
              <KeyRound className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              {step === 'email' ? 'Forgot password?' : 'Set new password'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {step === 'email'
                ? 'Enter your email and we will verify your account'
                : `Setting new password for ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                required
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="New password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={confirmError}
                required
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStep('email');
                    clearError();
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Reset password
                </Button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Remember it?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
