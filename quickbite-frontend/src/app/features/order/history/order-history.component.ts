import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { OrderResponse } from '../../../shared/models/models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading    = true;
  reordering: number | null = null;

  constructor(
    private orderService: OrderService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: orders => {
        this.orders = orders.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  reorder(orderId: number): void {
    this.reordering = orderId;
    this.orderService.reorder(orderId).subscribe({
      next: (newOrder) => {
        this.reordering = null;
        this.toast.success('Items added to cart! Redirecting to checkout...');
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        this.reordering = null;
        this.toast.error(err?.error?.message || 'Could not reorder.');
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}