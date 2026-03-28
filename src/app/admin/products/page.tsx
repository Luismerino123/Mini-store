'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import { productsApi } from '@/lib/api/fakestore';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { localProducts, removeProduct, toggleActive, isDeactivated } = useProductStore();

  useEffect(() => {
    productsApi
      .getAll()
      .then(setApiProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const localIds = new Set(localProducts.map((p) => p.id));
  const allProducts = [...localProducts, ...apiProducts.filter((p) => !localIds.has(p.id))];

  const handleDelete = async (id: number, isLocal: boolean) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      if (isLocal) {
        removeProduct(id);
      } else {
        await productsApi.remove(id);
        setApiProducts((prev) => prev.filter((p) => p.id !== id));
      }
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Price</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProducts.map((product) => {
                const deactivated = isDeactivated(product.id);
                const isLocal = localIds.has(product.id);
                return (
                  <tr key={product.id} className={deactivated ? 'opacity-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                          />
                        </div>
                        <span className="max-w-[200px] truncate font-medium text-slate-800">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info" className="capitalize">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={deactivated ? 'danger' : 'success'}>
                        {deactivated ? 'Inactive' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(product.id)}>
                          {deactivated ? (
                            <Eye className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-amber-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id, isLocal)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
