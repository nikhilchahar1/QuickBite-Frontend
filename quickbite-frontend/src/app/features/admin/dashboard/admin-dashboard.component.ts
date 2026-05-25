import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { OrderService } from '../../../core/services/order.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  error   = '';
  stats   = { orders: 0, restaurants: 0, pending: 0, revenue: 0 };
  recentOrders: any[] = [];

  adminLinks = [
    { icon: '👥', label: 'Users',         route: '/admin/users',         desc: 'Manage all users' },
    { icon: '🏪', label: 'Restaurants',   route: '/admin/restaurants',   desc: 'Approve & manage' },
    { icon: '📦', label: 'Orders',        route: '/admin/orders',        desc: 'All platform orders' },
    { icon: '⭐', label: 'Reviews',       route: '/admin/reviews',       desc: 'Moderate reviews' },
    { icon: '📢', label: 'Notifications', route: '/admin/notifications', desc: 'Send bulk messages' },
  ];

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    forkJoin({
      restaurants: this.restaurantService.getAll().pipe(catchError(() => of([]))),
      pending:     this.restaurantService.getPending().pipe(catchError(() => of([]))),
      orders:      this.orderService.getAllOrders().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: ({ restaurants, pending, orders }) => {
        this.stats.restaurants = restaurants.length;
        this.stats.pending     = pending.length;
        this.stats.orders      = orders.length;
        this.stats.revenue     = orders.reduce((s: number, o: any) => s + (o.finalAmount || 0), 0);
        this.recentOrders      = [...orders]
          .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 6);
      },
      error: () => {
        this.error = 'Could not load dashboard data.';
      }
    });
  }
}