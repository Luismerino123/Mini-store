import type { CartItem } from './cart';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
