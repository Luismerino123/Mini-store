'use client';

import { useState, useEffect, useMemo } from 'react';
import { productsApi } from '@/lib/api/fakestore';
import { paginate, getTotalPages } from '@/lib/utils';
import type { Product } from '@/types/product';

export type SortOrder = 'asc' | 'desc';

interface UseProductsOptions {
  perPage?: number;
}

export function useProducts({ perPage = 8 }: UseProductsOptions = {}) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, cats] = await Promise.all([
          productsApi.getAll(),
          productsApi.getCategories(),
        ]);
        setAllProducts(products);
        setCategories(cats);
      } catch {
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (category) result = result.filter((p) => p.category === category);

    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

    return result;
  }, [allProducts, search, category, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sortOrder]);

  return {
    products: paginate(filtered, page, perPage),
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
    totalPages: getTotalPages(filtered.length, perPage),
    totalCount: filtered.length,
  };
}
