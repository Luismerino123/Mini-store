'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, truncate } from '@/lib/utils';
import type { Product } from '@/types/product';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  isDeactivated?: boolean;
}

export function ProductCard({ product, isDeactivated = false }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated, user } = useAuthStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    addItem(product);
    toast.success(`${truncate(product.title, 25)} added to cart`);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className={`group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${isDeactivated ? 'opacity-50' : ''}`}
      >
        {isDeactivated && (
          <Badge variant="danger" className="absolute right-3 top-3 z-10">
            Inactive
          </Badge>
        )}

        <div className="relative mb-3 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Badge variant="info" className="w-fit capitalize">
            {product.category}
          </Badge>

          <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.rate}</span>
            <span>({product.rating.count})</span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>

            {(!isAuthenticated || user?.role === 'customer') && !isDeactivated && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ShoppingCart className="h-4 w-4" />
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
