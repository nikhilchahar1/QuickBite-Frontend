// QuickBite — TypeScript Models (matches backend DTOs exactly)

// ── Auth ──
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  role: 'CUSTOMER' | 'OWNER' | 'AGENT' | 'ADMIN';
  email: string;
  fullName: string;
  userId: number;
  message: string;
}

// ── Restaurant ──
export interface Restaurant {
  restaurantId: number;
  ownerId: number;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  avgRating: number;
  open: boolean;
  approved: boolean;
  deliveryRadius: number;
  minOrderAmount: number;
  estimatedDeliveryMin: number;
  imageUrl?: string;
}
export interface RestaurantRequest {
  name: string;
  description?: string;
  cuisine: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  deliveryRadius?: number;
  minOrderAmount?: number;
  estimatedDeliveryMin?: number;
  imageUrl?: string;
}

// ── Menu ──
export interface MenuCategory {
  categoryId: number;
  restaurantId: number;
  name: string;
  description?: string;
  sortOrder?: number;
}
export interface MenuItem {
  itemId: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  veg: boolean;
  available: boolean;
  rating: number;
  calories?: number;
  tags?: string;
}
export interface MenuItemRequest {
  restaurantId: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  veg?: boolean;
  calories?: number;
  tags?: string;
}
export interface CategoryRequest {
  restaurantId: number;
  name: string;
  description?: string;
  sortOrder?: number;
}

// ── Cart ──
export interface CartItem {
  cartItemId: number;
  itemId: number;
  itemName: string;
  itemImageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
}
export interface CartResponse {
  cartId: number;
  customerId: number;
  restaurantId?: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  appliedPromoCode?: string;
  updatedAt: string;
  items: CartItem[];
  itemCount: number;
  message?: string;
}
export interface AddItemRequest {
  itemId: number;
  restaurantId: number;
  itemName: string;
  price: number;
  quantity: number;
  itemImageUrl?: string;
}
export interface UpdateQuantityRequest {
  cartItemId: number;
  quantity: number;
}

// ── Order ──
export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
export type PaymentMode = 'COD' | 'RAZORPAY' | 'WALLET';

export interface OrderItem {
  orderItemId: number;
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}
export interface OrderResponse {
  orderId: number;
  customerId: number;
  restaurantId: number;
  deliveryAgentId?: number;
  totalAmount: number;
  discount?: number;
  finalAmount: number;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  orderDate: string;
  confirmedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  deliveryAddress: string;
  specialInstructions?: string;
  appliedPromoCode?: string;
  estimatedDeliveryMin?: number;
  orderItems: OrderItem[];
  message?: string;
}
export interface PlaceOrderRequest {
  restaurantId: number;
  paymentMode: PaymentMode;
  deliveryAddress: string;
  specialInstructions?: string;
  totalAmount: number;
  discount?: number;
  finalAmount: number;
  customerEmail: string;
  customerName: string;
  appliedPromoCode?: string;
  estimatedDeliveryMin?: number;
  items: OrderItemDto[];
}
export interface OrderItemDto {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}
export interface UpdateStatusRequest {
  orderStatus: OrderStatus;
  note?: string;
}

// ── Payment ──
export interface CreateOrderRequest {
  amount: number;
  quickbiteOrderId: number;
  description?: string;
}
export interface CreateOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  quickbiteOrderId: number;
}
export interface VerifyPaymentRequest {
  quickbiteOrderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount?: number;
}
export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  customerId: number;
  amount: number;
  paymentMode: PaymentMode;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  message?: string;
}
export interface WalletTopUpRequest {
  amount: number;
  description?: string;
}
export interface WalletResponse {
  walletId: number;
  customerId: number;
  balance: number;
  updatedAt: string;
}
export interface WalletStatementResponse {
  statementId: number;
  walletId: number;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  createdAt: string;
  balanceAfter: number;
}

// ── Review ──
export interface ReviewRequest {
  restaurantId: number;
  orderId: number;
  foodRating: number;
  deliveryRating?: number;
  comment?: string;
  deliveryAgentId?: number;
}
export interface ReviewResponse {
  reviewId: number;
  customerId: number;
  restaurantId: number;
  orderId: number;
  foodRating: number;
  deliveryRating?: number;
  comment?: string;
  verified: boolean;
  createdAt: string;
}

// ── Notification ──
export interface NotificationResponse {
  notificationId: number;
  recipientId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}
export interface SendNotificationRequest {
  recipientId: number;
  title: string;
  message: string;
  type?: string;
}
export interface BulkNotificationRequest {
  recipientIds: number[];
  title: string;
  message: string;
  type?: string;
}