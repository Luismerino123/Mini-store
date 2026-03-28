import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, UpdateProductInput } from '@/types/product';

interface ProductState {
  localProducts: Product[];
  deactivatedIds: number[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, data: UpdateProductInput) => void;
  removeProduct: (id: number) => void;
  toggleActive: (id: number) => void;
  isDeactivated: (id: number) => boolean;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      localProducts: [],
      deactivatedIds: [],

      addProduct: (product: Product) =>
        set((state) => ({ localProducts: [...state.localProducts, product] })),

      updateProduct: (id: number, data: UpdateProductInput) =>
        set((state) => ({
          localProducts: state.localProducts.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      removeProduct: (id: number) =>
        set((state) => ({
          localProducts: state.localProducts.filter((p) => p.id !== id),
          deactivatedIds: state.deactivatedIds.filter((i) => i !== id),
        })),

      toggleActive: (id: number) => {
        const { deactivatedIds } = get();
        const isDeactivated = deactivatedIds.includes(id);
        set({
          deactivatedIds: isDeactivated
            ? deactivatedIds.filter((i) => i !== id)
            : [...deactivatedIds, id],
        });
      },

      isDeactivated: (id: number) => get().deactivatedIds.includes(id),
    }),
    { name: 'mini-store-products' },
  ),
);
