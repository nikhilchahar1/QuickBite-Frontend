import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Restaurant, OrderResponse, OrderStatus } from '../../../shared/models/models';

@Component({
  selector: 'app-owner-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './owner-orders.component.html',
  styleUrls: ['./owner-orders.component.scss']
})
export class OwnerOrdersComponent implements OnInit {
  restaurants: Restaurant[] = [];
  selectedRestaurantId = 0;
  orders: OrderResponse[] = [];
  loading = false;
  updatingId: number | null = null;

  // Owners can set these statuses
  ownerStatuses: OrderStatus[] = ['CONFIRMED', 'PREPARING'];

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getMyRestaurants().subscribe({
      next: list => {
        this.restaurants = list;
        if (list.length > 0) {
          this.selectedRestaurantId = list[0].restaurantId;
          this.loadOrders();
        }
      }
    });
  }

  loadOrders(): void {
    if (!this.selectedRestaurantId) return;
    this.loading = true;
    this.orderService.getRestaurantOrders(this.selectedRestaurantId).subscribe({
      next: orders => {
        this.orders = orders.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateStatus(orderId: number, status: OrderStatus): void {
    this.updatingId = orderId;
    this.orderService.updateStatus(orderId, { orderStatus: status }).subscribe({
      next: updated => {
        const idx = this.orders.findIndex(o => o.orderId === orderId);
        if (idx !== -1) this.orders[idx] = updated;
        this.updatingId = null;
        this.toast.success(`Order #${orderId} marked as ${status}`);
      },
      error: (err) => {
        this.updatingId = null;
        this.toast.error(err?.error?.message || 'Could not update status.');
      }
    });
  }

  getNextStatus(current: OrderStatus): OrderStatus | null {
    const flow: Record<string, OrderStatus> = {
      PLACED: 'CONFIRMED', CONFIRMED: 'PREPARING'
    };
    return flow[current] || null;
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
  }
}