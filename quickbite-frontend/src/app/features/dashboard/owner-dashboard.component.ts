import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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
  error = '';

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getMyRestaurants().pipe(
      catchError(() => of([])),
      finalize(() => { })
    ).subscribe(list => {
      this.restaurants = list;

      if (list.length === 0) {
        this.loading = false;
        return;
      }

      // Load orders for first restaurant in parallel — don't block UI on failure
      this.orderService.getRestaurantOrders(list[0].restaurantId).pipe(
        catchError(() => of([])),
        finalize(() => { this.loading = false; })
      ).subscribe(orders => {
        this.recentOrders = orders
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 5);
      });
    });
  }

  toggle(restaurant: Restaurant): void {
    this.togglingId = restaurant.restaurantId;
    this.restaurantService.toggleOpen(restaurant.restaurantId).pipe(
      catchError(err => {
        this.toast.error('Could not toggle restaurant status.');
        this.togglingId = null;
        return of(restaurant);
      })
    ).subscribe(updated => {
      const idx = this.restaurants.findIndex(r => r.restaurantId === updated.restaurantId);
      if (idx !== -1) this.restaurants[idx] = { ...updated };
      this.togglingId = null;
      this.toast.success(`${updated.name} is now ${updated.open ? 'Open' : 'Closed'}`);
    });
  }

  getTodayRevenue(): number {
    const today = new Date().toDateString();
    return this.recentOrders
      .filter(o => new Date(o.orderDate).toDateString() === today)
      .reduce((sum, o) => sum + o.finalAmount, 0);
  }

  getPendingCount(): number {
    return this.recentOrders.filter(o => o.orderStatus === 'PLACED').length;
  }
}