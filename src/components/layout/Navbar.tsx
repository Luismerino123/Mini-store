'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, User, Package, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const getTotalItems = useCartStore((s) => s.getTotalItems);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Package className="h-6 w-6" />
          MiniStore
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            Products
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}

          {(!isAuthenticated || user?.role === 'customer') && (
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600" />
              {getTotalItems() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => router.push('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
