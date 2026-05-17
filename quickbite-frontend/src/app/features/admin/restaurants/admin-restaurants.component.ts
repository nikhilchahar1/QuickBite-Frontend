import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Restaurant } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './admin-restaurants.component.html',
  styleUrls: ['./admin-restaurants.component.scss']
})
export class AdminRestaurantsComponent implements OnInit {
  all: Restaurant[] = [];
  pending: Restaurant[] = [];
  activeTab: 'pending' | 'all' = 'pending';
  loading = true;
  approvingId: number | null = null;

  constructor(private restaurantService: RestaurantService, private toast: ToastService) {}

  ngOnInit(): void {
    Promise.all([
      this.restaurantService.getAll().toPromise(),
      this.restaurantService.getPending().toPromise()
    ]).then(([all, pending]) => {
      this.all     = all || [];
      this.pending = pending || [];
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }

  approve(id: number): void {
    this.approvingId = id;
    this.restaurantService.approve(id).subscribe({
      next: updated => {
        this.pending  = this.pending.filter(r => r.restaurantId !== id);
        const idx = this.all.findIndex(r => r.restaurantId === id);
        if (idx !== -1) this.all[idx] = updated;
        else this.all.push(updated);
        this.approvingId = null;
        this.toast.success(`${updated.name} approved!`);
      },
      error: () => { this.approvingId = null; }
    });
  }

  delete(id: number, name: string): void {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    this.restaurantService.delete(id).subscribe({
      next: () => {
        this.all     = this.all.filter(r => r.restaurantId !== id);
        this.pending = this.pending.filter(r => r.restaurantId !== id);
        this.toast.success('Restaurant deleted.');
      }
    });
  }
}