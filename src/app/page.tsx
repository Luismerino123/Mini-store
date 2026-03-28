'use client';

import Link from 'next/link';
import { ArrowRight, Package2, ShoppingCart, Users, Zap, ShieldCheck } from 'lucide-react';

const stats = [
  { value: '20+', label: 'Products' },
  { value: '4', label: 'Categories' },
  { value: '100%', label: 'Persistent cart' },
  { value: '2', label: 'User roles' },
];

const features = [
  {
    icon: Package2,
    title: 'Product Catalog',
    description: 'Browse, search, and filter products by category. Sorted by price or relevance.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: ShoppingCart,
    title: 'Persistent Cart',
    description: 'Add items, adjust quantities, and checkout. Cart survives page reloads.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Admin panel to manage products and view orders. Customers can shop freely.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: ShieldCheck,
    title: 'Auth with Persist',
    description: 'Registration, login and session persistence via Zustand + localStorage.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Zap,
    title: 'Fast & Typed',
    description: 'Built with Next.js 14, TypeScript strict mode and Tailwind CSS utility classes.',
    color: 'bg-sky-50 text-sky-600',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-slate-900 px-4 pb-24 pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.5), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Technical assessment project
          </span>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Mini Store{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              E-Commerce
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            A full-featured store template built with Next.js 14, Zustand, and the FakeStore API.
            Role-based access, persistent cart, and admin dashboard included.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
            >
              Browse products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-slate-300 transition-all hover:border-slate-600 hover:text-white"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-center backdrop-blur-sm"
            >
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              What&apos;s included
            </h2>
            <p className="mt-2 text-slate-500">Everything built from scratch for this assessment</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 font-semibold text-slate-800">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            Try it now
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:max-w-56">
              <span className="inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                Admin
              </span>
              <p className="mt-3 font-mono text-sm text-slate-700">admin@ministore.com</p>
              <p className="font-mono text-sm text-slate-400">admin123</p>
            </div>
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:max-w-56">
              <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Customer
              </span>
              <p className="mt-3 font-mono text-sm text-slate-700">customer@ministore.com</p>
              <p className="font-mono text-sm text-slate-400">customer123</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
