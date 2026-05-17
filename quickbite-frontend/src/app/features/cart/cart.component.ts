import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { RestaurantService } from '../../core/services/restaurant.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { CartResponse, Restaurant } from '../../shared/models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;
  restaurant: Restaurant | null = null;
  loading        = true;
  promoCode      = '';
  applyingPromo  = false;
  clearingCart   = false;
  updatingItemId: number | null = null;

  constructor(
    private cartService: CartService,
    private restaurantService: RestaurantService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (cart?.restaurantId) this.loadRestaurant(cart.restaurantId);
    });
    this.cartService.getCart().subscribe({
      next: () => { this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  private loadRestaurant(id: number): void {
    this.restaurantService.getById(id).subscribe(r => this.restaurant = r);
  }

  updateQty(cartItemId: number, delta: number, currentQty: number): void {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      this.removeItem(cartItemId);
      return;
    }
    this.updatingItemId = cartItemId;
    this.cartService.updateQuantity({ cartItemId, quantity: newQty }).subscribe({
      next: () => { this.updatingItemId = null; },
      error: () => { this.updatingItemId = null; this.toast.error('Could not update quantity.'); }
    });
  }

  removeItem(cartItemId: number): void {
    this.cartService.removeItem(cartItemId).subscribe({
      error: () => this.toast.error('Could not remove item.')
    });
  }

  applyPromo(): void {
    if (!this.promoCode.trim()) return;
    this.applyingPromo = true;
    this.cartService.applyPromo(this.promoCode.trim().toUpperCase()).subscribe({
      next: () => { this.applyingPromo = false; this.toast.success('Promo code applied!'); },
      error: (err) => {
        this.applyingPromo = false;
        this.toast.error(err?.error?.message || 'Invalid promo code.');
      }
    });
  }

  removePromo(): void {
    this.cartService.removePromo().subscribe({
      next: () => { this.promoCode = ''; this.toast.info('Promo code removed.'); }
    });
  }

  clearCart(): void {
    if (!confirm('Clear entire cart?')) return;
    this.clearingCart = true;
    this.cartService.clearCart().subscribe({
      next: () => { this.clearingCart = false; this.restaurant = null; },
      error: () => { this.clearingCart = false; }
    });
  }

  goToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) return;
    this.router.navigate(['/checkout']);
  }

  get isEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }
}