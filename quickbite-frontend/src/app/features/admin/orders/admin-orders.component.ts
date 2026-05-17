import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { OrderResponse } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  filtered: OrderResponse[] = [];
  loading = true;
  selectedStatus = '';
  statuses = ['PLACED','CONFIRMED','PREPARING','PICKED_UP','DELIVERED','CANCELLED'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: orders => {
        this.orders = orders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.filter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filter(): void {
    this.filtered = this.selectedStatus
      ? this.orders.filter(o => o.orderStatus === this.selectedStatus)
      : [...this.orders];
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  }
}