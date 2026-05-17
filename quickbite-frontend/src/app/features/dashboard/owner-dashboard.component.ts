import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../core/services/restaurant.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { Restaurant, OrderResponse } from '../../shared/models/models';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  restaurants: Restaurant[] = [];
  recentOrders: OrderResponse[] = [];
  loading = true;
  togglingId: number | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getMyRestaurants().subscribe({
      next: list => {
        this.restaurants = list;
        if (list.length > 0) this.loadOrders(list[0].restaurantId);
        else this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private loadOrders(restaurantId: number): void {
    this.orderService.getRestaurantOrders(restaurantId).subscribe({
      next: orders => {
        this.recentOrders = orders
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 5);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  toggle(restaurant: Restaurant): void {
    this.togglingId = restaurant.restaurantId;
    this.restaurantService.toggleOpen(restaurant.restaurantId).subscribe({
      next: updated => {
        const idx = this.restaurants.findIndex(r => r.restaurantId === updated.restaurantId);
        if (idx !== -1) this.restaurants[idx] = updated;
        this.togglingId = null;
        this.toast.success(`${updated.name} is now ${updated.open ? 'Open' : 'Closed'}`);
      },
      error: () => { this.togglingId = null; }
    });
  }

  getTodayRevenue(restaurantId: number): number {
    const today = new Date().toDateString();
    return this.recentOrders
      .filter(o => new Date(o.orderDate).toDateString() === today && o.restaurantId === restaurantId)
      .reduce((sum, o) => sum + o.finalAmount, 0);
  }

  getPendingCount(restaurantId: number): number {
    return this.recentOrders.filter(o =>
      o.restaurantId === restaurantId && o.orderStatus === 'PLACED'
    ).length;
  }
}