// ─── REVIEW MODELS ────────────────────────────────────────────────

// Matches backend: ReviewResponse.java
export interface ReviewResponse {
  reviewId: number;
  orderId: number;
  customerId: number;
  restaurantId: number;
  agentId?: number;
  foodRating: number;
  deliveryRating?: number;
  comment?: string;
  reviewDate: string;
  isVerified: boolean;
}

// Matches backend: ReviewRequest.java
export interface ReviewRequest {
  orderId: number;
  restaurantId: number;
  agentId?: number;
  foodRating: number;
  deliveryRating?: number;
  comment?: string;
}

// Matches backend: AverageRatingResponse.java
export interface AverageRatingResponse {
  restaurantId?: number;
  agentId?: number;
  averageRating: number;
  totalReviews: number;
}

// ─── NOTIFICATION MODELS ──────────────────────────────────────────

export type NotificationType = 'ORDER' | 'PAYMENT' | 'PROMO' | 'DELIVERY';
export type NotificationChannel = 'APP' | 'EMAIL' | 'SMS';

// Matches backend: NotificationResponse.java
export interface NotificationResponse {
  notificationId: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  relatedId?: number;
  relatedType?: string;
  isRead: boolean;
  sentAt: string;
}

// Matches backend: SendNotificationRequest.java
export interface SendNotificationRequest {
  recipientId: number;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  relatedId?: number;
}
