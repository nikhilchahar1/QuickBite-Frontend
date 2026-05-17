import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  stats = { orders: 0, restaurants: 0, pending: 0, revenue: 0 };
  recentOrders: any[] = [];

  adminLinks = [
    { icon: '👥', label: 'Users',         route: '/admin/users',         desc: 'Manage all users' },
    { icon: '🏪', label: 'Restaurants',   route: '/admin/restaurants',   desc: 'Approve & manage restaurants' },
    { icon: '📦', label: 'Orders',        route: '/admin/orders',        desc: 'View all platform orders' },
    { icon: '⭐', label: 'Reviews',       route: '/admin/reviews',       desc: 'Moderate reviews' },
    { icon: '📢', label: 'Notifications', route: '/admin/notifications', desc: 'Send bulk notifications' },
  ];

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    Promise.all([
      this.restaurantService.getAll().toPromise(),
      this.restaurantService.getPending().toPromise(),
      this.orderService.getAllOrders().toPromise()
    ]).then(([restaurants, pending, orders]) => {
      this.stats.restaurants = restaurants?.length || 0;
      this.stats.pending     = pending?.length || 0;
      this.stats.orders      = orders?.length || 0;
      this.stats.revenue     = orders?.reduce((s, o) => s + (o.finalAmount || 0), 0) || 0;
      this.recentOrders      = (orders || [])
        .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 6);
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }
}