import type { Product, CreateProductInput, UpdateProductInput } from '@/types/product';

const BASE_URL = 'https://fakestoreapi.com';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) message = errorData.message;
    } catch {}
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const productsApi = {
  getAll: (limit?: number): Promise<Product[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<Product[]>(`/products${query}`);
  },

  getById: (id: number): Promise<Product> => request<Product>(`/products/${id}`),

  getCategories: (): Promise<string[]> => request<string[]>('/products/categories'),

  getByCategory: (category: string): Promise<Product[]> =>
    request<Product[]>(`/products/category/${encodeURIComponent(category)}`),

  create: (data: CreateProductInput): Promise<Product> =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateProductInput): Promise<Product> =>
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: number): Promise<Product> =>
    request<Product>(`/products/${id}`, { method: 'DELETE' }),
};
