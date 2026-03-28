'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, checkout, getTotalItems, getTotalPrice } =
    useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    checkout(user.id, user.name);
    toast.success('Order placed successfully!');
    router.push('/products');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6 px-4 text-center">
        <ShoppingBag className="h-20 w-20 text-gray-200" />
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Add some products to get started</p>
        </div>
        <Link href="/products">
          <Button>
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Shopping Cart ({getTotalItems()} items)
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-sm font-bold text-blue-600">{formatPrice(product.price)}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      removeItem(product.id);
                      toast.success('Item removed');
                    }}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>

          <div className="mb-4 flex flex-col gap-2 border-b border-gray-100 pb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm text-gray-600">
                <span className="line-clamp-1 max-w-[140px]">{product.title}</span>
                <span>x{quantity}</span>
              </div>
            ))}
          </div>

          <div className="mb-6 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
          </div>

          <Button onClick={handleCheckout} className="w-full">
            <ShoppingBag className="h-4 w-4" />
            {isAuthenticated ? 'Place Order' : 'Login to Checkout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
