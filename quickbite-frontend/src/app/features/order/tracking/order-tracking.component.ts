import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { OrderResponse, OrderStatus } from '../../../shared/models/models';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  order: OrderResponse | null = null;
  loading    = true;
  cancelling = false;
  private sub!: Subscription;

  steps: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
    { status: 'PLACED',    label: 'Order Placed',   icon: '📋', desc: 'Your order has been received' },
    { status: 'CONFIRMED', label: 'Confirmed',       icon: '✅', desc: 'Restaurant confirmed your order' },
    { status: 'PREPARING', label: 'Preparing',       icon: '👨‍🍳', desc: 'Your food is being prepared' },
    { status: 'PICKED_UP', label: 'Out for Delivery',icon: '🛵', desc: 'Rider is on the way to you' },
    { status: 'DELIVERED', label: 'Delivered',       icon: '🎉', desc: 'Enjoy your meal!' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    public  auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Auto-refresh every 15s
    this.sub = interval(15000).pipe(
      startWith(0),
      switchMap(() => this.orderService.getById(id))
    ).subscribe({
      next: order => { this.order = order; this.loading = false; },
      error: ()    => {
        this.loading = false;
        this.toast.error('Order not found.');
        this.router.navigate(['/orders']);
      }
    });
  }

  getStepIndex(status: OrderStatus): number {
    if (status === 'CANCELLED') return -1;
    return this.steps.findIndex(s => s.status === status);
  }

  isCompleted(stepStatus: OrderStatus): boolean {
    if (!this.order) return false;
    const current = this.getStepIndex(this.order.orderStatus);
    const step    = this.getStepIndex(stepStatus);
    return step <= current;
  }

  isActive(stepStatus: OrderStatus): boolean {
    return this.order?.orderStatus === stepStatus;
  }

  cancelOrder(): void {
    if (!this.order) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;
    this.cancelling = true;
    this.orderService.cancelOrder(this.order.orderId).subscribe({
      next: (updated) => {
        this.order = updated;
        this.cancelling = false;
        this.toast.success('Order cancelled successfully.');
      },
      error: (err) => {
        this.cancelling = false;
        this.toast.error(err?.error?.message || 'Cannot cancel order at this stage.');
      }
    });
  }

  get canCancel(): boolean {
    return this.order?.orderStatus === 'PLACED';
  }

  get isDelivered(): boolean {
    return this.order?.orderStatus === 'DELIVERED';
  }

  get isCancelled(): boolean {
    return this.order?.orderStatus === 'CANCELLED';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}