// Matches backend: Restaurant.java entity
export interface Restaurant {
  restaurantId: number;
  ownerId: number;
  name: string;
  description?: string;
  cuisine: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  avgRating: number;
  isOpen: boolean;
  isApproved: boolean;
  deliveryRadius?: number;
  minOrderAmount?: number;
  estimatedDeliveryMin?: number;
  imageUrl?: string;
}

// Matches backend: RestaurantRequest.java
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
