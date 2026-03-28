'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { productsApi } from '@/lib/api/fakestore';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Product } from '@/types/product';
import toast from 'react-hot-toast';

const CATEGORIES = ["electronics", "jewelery", "men's clothing", "women's clothing"];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { localProducts, updateProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const local = localProducts.find((p) => p.id === Number(id));
        const product: Product = local ?? (await productsApi.getById(Number(id)));
        setForm({
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, localProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await productsApi.update(Number(id), form);
      updateProduct(Number(id), form);
      toast.success('Product updated!');
      router.push('/admin/products');
    } catch {
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-blue-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price (USD)"
              type="number"
              min={0}
              step={0.01}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Image URL"
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
