/**
 * Shared types for Prod'Oine e-commerce.
 */

export interface ProductOption {
  _id: string;
  key: string;
  label: string;
  choices: ProductOptionChoice[];
}

export interface ProductOptionChoice {
  value: string;
  label: string;
  priceModifier: number;
  imageSuffix?: string;
}

export interface Product {
  _id: string;
  collectionName: string;
  title: string;
  description?: string;
  basePrice: number;
  options: ProductOption[];
  defaultOptions?: Record<string, string>;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SelectedOptions = Record<string, string>;

export interface CartItem {
  productId: string;
  productName: string;
  selectedOptions: SelectedOptions;
  quantity: number;
  unitPriceCents?: number;
  imagePath?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  selectedOptions: SelectedOptions;
  quantity: number;
  unitPriceCents: number;
  imagePath?: string;
}

export interface Order {
  _id: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  email: string;
  status: "pending" | "paid" | "failed" | "refunded";
  totalCents: number;
  items: OrderItemSnapshot[];
  createdAt: Date;
  updatedAt: Date;
}
