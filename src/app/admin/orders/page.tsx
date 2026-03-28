'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const orders = useCartStore((s) => s.orders);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
          <ShoppingBag className="h-12 w-12 text-slate-200" />
          <p className="text-slate-500">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[...orders].reverse().map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Order #{order.id.slice(-6)}</p>
                  <p className="text-sm text-slate-500">
                    {order.userName} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{order.status}</Badge>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.items.map(({ product, quantity }) => (
                  <span
                    key={product.id}
                    className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-600"
                  >
                    {product.title.slice(0, 25)}... ×{quantity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
