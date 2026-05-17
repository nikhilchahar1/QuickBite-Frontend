export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

// Matches backend: PaymentResponse.java
export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  customerId: number;
  amount: number;
  paymentMode: string;
  status: PaymentStatus;
  transactionId?: string;
  currency: string;
  paidAt?: string;
  refundedAt?: string;
  failureReason?: string;
  message?: string;
}

// Matches backend: CreateOrderRequest.java (Razorpay Step 1)
export interface CreateRazorpayOrderRequest {
  amount: number;           // in rupees
  quickbiteOrderId: number;
  description?: string;
}

// Matches backend: CreateOrderResponse.java (Razorpay Step 1 response)
export interface CreateRazorpayOrderResponse {
  razorpayOrderId: string;
  quickbiteOrderId: number;
  amount: number;
  currency: string;
  keyId: string;            // Razorpay key for opening popup
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

// Matches backend: VerifyPaymentRequest.java (Razorpay Step 2)
export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  quickbiteOrderId: number;
  amount: number;
}

// Matches backend: WalletResponse.java
export interface WalletResponse {
  walletId: number;
  customerId: number;
  balance: number;
  message?: string;
}

// Matches backend: WalletTopUpRequest.java
export interface WalletTopUpRequest {
  amount: number;
}

// Matches backend: WalletStatementResponse.java
export interface WalletStatementResponse {
  statementId: number;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: number;
  createdAt: string;
}
