export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMode = 'COD' | 'CARD' | 'UPI' | 'WALLET';

// Matches backend: OrderResponse.java
export interface OrderResponse {
  orderId: number;
  customerId: number;
  restaurantId: number;
  deliveryAgentId?: number;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  orderDate: string;
  confirmedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  estimatedDeliveryMin: number;
  deliveryAddress: string;
  specialInstructions?: string;
  appliedPromoCode?: string;
  orderItems: OrderItemDto[];
  message?: string;
}

// Matches backend: OrderItemDto.java
export interface OrderItemDto {
  menuItemId: number;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
  customization?: string;
}

// Matches backend: PlaceOrderRequest.java
export interface PlaceOrderRequest {
  restaurantId: number;
  items: OrderItemDto[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMode: PaymentMode;
  deliveryAddress: string;
  specialInstructions?: string;
  appliedPromoCode?: string;
  estimatedDeliveryMin?: number;
  customerEmail?: string;
  customerName?: string;
}

// Matches backend: UpdateStatusRequest.java
export interface UpdateStatusRequest {
  status: OrderStatus;
}
