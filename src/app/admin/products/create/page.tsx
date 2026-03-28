'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { productsApi } from '@/lib/api/fakestore';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CreateProductInput } from '@/types/product';
import toast from 'react-hot-toast';

const CATEGORIES = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

export default function CreateProductPage() {
  const router = useRouter();
  const { addProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateProductInput>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductInput, string>>>({});

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.price <= 0) errs.price = 'Price must be greater than 0';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.image.trim()) errs.image = 'Image URL is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await productsApi.create(form);
      addProduct({ ...form, id: Date.now(), rating: { rate: 0, count: 0 } });
      toast.success('Product created!');
      router.push('/admin/products');
    } catch {
      toast.error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Create Product</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            </div>

            <Input
              label="Price (USD)"
              type="number"
              min={0}
              step={0.01}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              error={errors.price}
              required
            />
          </div>

          <Input
            label="Image URL"
            type="url"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            error={errors.image}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Product description..."
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isLoading}>
              Create Product
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
