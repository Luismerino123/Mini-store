'use client';

import { useProducts } from '@/hooks/useProducts';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { Package } from 'lucide-react';

export default function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    categories,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    totalPages,
    totalCount,
  } = useProducts({ perPage: 8 });

  const { isDeactivated } = useProductStore();

  if (error) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <Package className="h-12 w-12 text-red-400" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <p className="mt-1 text-gray-500">Discover our full catalog</p>
      </div>

      <div className="mb-6">
        <ProductFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          totalCount={totalCount}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
          <Package className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isDeactivated={isDeactivated(product.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
