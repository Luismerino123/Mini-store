'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, User, Package2, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const getTotalItems = useCartStore((s) => s.getTotalItems);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Package2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg tracking-tight">
            Mini<span className="text-indigo-600">Store</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className={cn(
              'text-sm font-medium transition-colors',
              pathname?.startsWith('/products')
                ? 'text-indigo-600'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            Products
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                pathname?.startsWith('/admin')
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          <div className="flex items-center gap-3">
            {(!isAuthenticated || user?.role === 'customer') && (
              <Link href="/cart" className="relative">
                <ShoppingCart
                  className={cn(
                    'h-5 w-5 transition-colors',
                    pathname === '/cart'
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900',
                  )}
                />
                {getTotalItems() > 0 && (
                  <span className="absolute -right-2 -top-2 flex min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 py-px text-[10px] font-bold text-white">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-1.5 sm:flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100">
                    <User className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  Sign in
                </Button>
                <Button size="sm" onClick={() => router.push('/register')}>
                  Get started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
