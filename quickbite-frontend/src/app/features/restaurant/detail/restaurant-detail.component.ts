import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { MenuService } from '../../../core/services/menu.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import {
  Restaurant, MenuCategory, MenuItem, AddItemRequest, CartResponse
} from '../../../shared/models/models';

interface CategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | null = null;
  categoriesWithItems: CategoryWithItems[] = [];
  currentCart: CartResponse | null = null;
  loading   = true;
  addingItemId: number | null = null;

  // Filter
  vegOnly = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private cartService: CartService,
    public  auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRestaurant(id);

    // Keep cart in sync
    if (this.auth.isCustomer()) {
      this.cartService.cart$.subscribe(c => this.currentCart = c);
    }
  }

  private loadRestaurant(id: number): void {
    this.restaurantService.getById(id).subscribe({
      next: r => {
        this.restaurant = r;
        this.loadMenu(id);
      },
      error: () => {
        this.toast.error('Restaurant not found.');
        this.router.navigate(['/restaurants']);
      }
    });
  }

  private loadMenu(restaurantId: number): void {
    this.menuService.getCategories(restaurantId).subscribe(categories => {
      this.menuService.getItemsByRestaurant(restaurantId).subscribe(items => {
        this.categoriesWithItems = categories.map(cat => ({
          ...cat,
          items: items.filter(item => item.categoryId === cat.categoryId && item.available)
        })).filter(cat => cat.items.length > 0);
        this.loading = false;
      });
    });
  }

  get filteredCategories(): CategoryWithItems[] {
    if (!this.vegOnly) return this.categoriesWithItems;
    return this.categoriesWithItems.map(cat => ({
      ...cat,
      items: cat.items.filter(i => i.veg)
    })).filter(cat => cat.items.length > 0);
  }

  addToCart(item: MenuItem): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    if (!this.auth.isCustomer()) return;

    // Check if cart has items from a different restaurant
    if (this.currentCart?.restaurantId &&
        this.currentCart.restaurantId !== this.restaurant!.restaurantId &&
        this.currentCart.items.length > 0) {
      if (!confirm('Your cart has items from another restaurant. Clear cart and switch?')) {
        return;
      }
      this.cartService.switchRestaurant(this.restaurant!.restaurantId).subscribe({
        next: () => this.doAddToCart(item),
        error: () => this.toast.error('Could not switch restaurant.')
      });
      return;
    }

    this.doAddToCart(item);
  }

  private doAddToCart(item: MenuItem): void {
    this.addingItemId = item.itemId;
    const req: AddItemRequest = {
      itemId:      item.itemId,
      restaurantId: this.restaurant!.restaurantId,
      itemName:    item.name,
      price:       item.discountedPrice || item.price,
      quantity:    1,
      itemImageUrl: item.imageUrl
    };

    this.cartService.addItem(req).subscribe({
      next: () => {
        this.addingItemId = null;
        this.toast.success(`${item.name} added to cart!`);
      },
      error: (err) => {
        this.addingItemId = null;
        this.toast.error(err?.error?.message || 'Could not add to cart.');
      }
    });
  }

  getItemQtyInCart(itemId: number): number {
    if (!this.currentCart) return 0;
    const found = this.currentCart.items.find(i => i.itemId === itemId);
    return found?.quantity || 0;
  }

  removeFromCart(itemId: number): void {
    if (!this.currentCart) return;
    const found = this.currentCart.items.find(i => i.itemId === itemId);
    if (!found) return;
    this.cartService.removeItem(found.cartItemId).subscribe();
  }

  scrollToCategory(id: number): void {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get cartItemCount(): number {
    return this.currentCart?.itemCount || 0;
  }

  goToCart(): void { this.router.navigate(['/cart']); }
}