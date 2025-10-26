export interface PosterSize {
  width: number;
  height: number;
  price: number;
}

export interface StandardSize {
  label: string;
  width: number;
  height: number;
  priceWithoutBoard: number;
  priceWithBoard?: number;
}

export const DEFAULT_SIZES: StandardSize[] = [
  { label: '12" × 8"', width: 12, height: 8, priceWithoutBoard: 350, priceWithBoard: 450 },
  { label: '18" × 12"', width: 18, height: 12, priceWithoutBoard: 550, priceWithBoard: 700 },
  { label: '24" × 16"', width: 24, height: 16, priceWithoutBoard: 850, priceWithBoard: 1050 },
  { label: '35" × 24"', width: 35, height: 24, priceWithoutBoard: 1500 },
];

export const STANDARD_SIZES: StandardSize[] = DEFAULT_SIZES;

export const SHIPPING_COST = {
  INSIDE_DHAKA: 80,
  OUTSIDE_DHAKA: 120,
};

export interface OrderItem {
  width: number;
  height: number;
  withBoard: boolean;
  price: number;
  imageUrl?: string;
  imageFile?: File;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  insideDhaka: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  item: OrderItem; // For backward compatibility
  items?: OrderItem[]; // Multiple items support
  shipping: ShippingInfo;
  paymentMethod: 'cod' | 'bkash';
  bkashTransactionId?: string;
  shippingCost: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'ready_to_ship' | 'completed';
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalRevenue: number;
}
