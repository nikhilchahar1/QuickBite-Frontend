import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthResponse } from '../../models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: AuthResponse | null = null;
  cartCount    = signal(0);
  unreadCount  = signal(0);
  menuOpen     = signal(false);
  dropdownOpen = signal(false);

  private subs: Subscription[] = [];

  constructor(
    public auth: AuthService,
    private cartService: CartService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    // React to login/logout
    this.subs.push(
      this.auth.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          if (this.auth.isCustomer()) this.loadCart();
          this.startNotifPolling();
        } else {
          this.cartCount.set(0);
          this.unreadCount.set(0);
        }
      })
    );
  }

  private loadCart(): void {
    // Subscribe to cart$ for live badge update
    this.subs.push(
      this.cartService.cart$.subscribe(cart => {
        this.cartCount.set(cart?.itemCount ?? 0);
      })
    );
    // Fetch cart once to populate
    this.cartService.getCart().subscribe();
  }

  private startNotifPolling(): void {
    this.subs.push(
      interval(30000).pipe(startWith(0)).subscribe(() => {
        if (this.auth.isLoggedIn()) {
          this.notifService.getUnreadCount().subscribe(r => {
            this.unreadCount.set(r.count);
          });
        }
      })
    );
  }

  toggleMenu(): void { this.menuOpen.update(v => !v); this.dropdownOpen.set(false); }
  toggleDropdown(): void { this.dropdownOpen.update(v => !v); }
  closeAll(): void { this.menuOpen.set(false); this.dropdownOpen.set(false); }

  logout(): void {
    this.auth.logout();
    this.closeAll();
  }

  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }
}