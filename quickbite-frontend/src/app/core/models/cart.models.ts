// Matches backend: CartResponse.java
export interface CartResponse {
  cartId: number;
  customerId: number;
  restaurantId: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  appliedPromoCode?: string;
  items: CartItemResponse[];
}

export interface CartItemResponse {
  itemId: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
  subtotal: number;
  imageUrl?: string;
  isVeg?: boolean;
}

// Matches backend: AddItemRequest.java
export interface AddItemRequest {
  menuItemId: number;
  restaurantId: number;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
}

// Matches backend: UpdateQuantityRequest.java
export interface UpdateQuantityRequest {
  quantity: number;
}

// Matches backend: PromoCodeRequest.java
export interface PromoCodeRequest {
  promoCode: string;
}
