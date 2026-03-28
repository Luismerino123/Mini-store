'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { productsApi } from '@/lib/api/fakestore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productsApi.getById(Number(id));
        setProduct(data);
      } catch {
        setError('Product not found');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    addItem(product);
    toast.success('Added to cart!');
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </button>

      <div className="grid gap-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-2">
        <div className="relative flex h-80 items-center justify-center rounded-xl bg-gray-50 p-8 md:h-96">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <Badge variant="info" className="w-fit capitalize">
            {product.category}
          </Badge>

          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating.rate)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</p>

          <p className="leading-relaxed text-gray-600">{product.description}</p>

          {(!isAuthenticated || user?.role === 'customer') && (
            <Button size="lg" onClick={handleAddToCart} className="mt-auto w-full sm:w-auto">
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
