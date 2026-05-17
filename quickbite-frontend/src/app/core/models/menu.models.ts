// Matches backend: MenuCategory.java
export interface MenuCategory {
  categoryId: number;
  restaurantId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

// Matches backend: MenuItem.java
export interface MenuItem {
  itemId: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating?: number;
  calories?: number;
  tags?: string;
}

// Matches backend: MenuItemRequest.java
export interface MenuItemRequest {
  restaurantId: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  isVeg: boolean;
  calories?: number;
  tags?: string;
}

// Matches backend: CategoryRequest.java
export interface CategoryRequest {
  restaurantId: number;
  name: string;
  description?: string;
  displayOrder?: number;
}
