export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // in UGX
  salePrice?: number; // in UGX
  stock: number;
  sku: string;
  category: string;
  images: string[];
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  directions: string;
  ingredients: string;
  packageInfo: string;
  manufacturer: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'mtn_mobile_money' | 'airtel_money' | 'bank_card' | 'cash_on_delivery';

export type PaymentStatus = 'Pending' | 'Successful' | 'Failed' | 'Cancelled' | 'Refund Pending' | 'Refunded';

export type OrderStatus =
  | 'Pending'
  | 'Awaiting Payment'
  | 'Paid'
  | 'Processing'
  | 'Ready for Dispatch'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  district: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionRef: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  transactionRef: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale' | 'adjustment' | 'damaged';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface StoreSettings {
  id: string;
  businessName: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  currency: string;
  timeZone: string;
  deliveryKampala: number;
  deliveryWakiso: number;
  deliveryUpcountry: number;
  freeDeliveryThreshold: number;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  missionStatement: string;
  sandboxMode: boolean;
  adminSecurityKey?: string;
  isSeeded?: boolean;
  deletedProductIds?: string[];
  updatedAt: string;
}

export interface Customer {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  district?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface StoreBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  linkText: string;
  isActive: boolean;
}
