'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { productsApi } from '@/lib/api/fakestore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const orders = useCartStore((s) => s.orders);

  useEffect(() => {
    productsApi.getAll().then((p) => setProductCount(p.length));
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    { label: 'Total Products', value: productCount, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <Package className="mb-2 h-6 w-6 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Manage Products</h3>
          <p className="mt-1 text-sm text-gray-500">Create, edit and deactivate products</p>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <ShoppingBag className="mb-2 h-6 w-6 text-green-600" />
          <h3 className="font-semibold text-gray-800">View Orders</h3>
          <p className="mt-1 text-sm text-gray-500">See all customer orders</p>
        </Link>
      </div>
    </div>
  );
}
