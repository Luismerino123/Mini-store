export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  isActive?: boolean;
}

export type CreateProductInput = Omit<Product, 'id' | 'rating' | 'isActive'>;

export type UpdateProductInput = Partial<CreateProductInput>;
