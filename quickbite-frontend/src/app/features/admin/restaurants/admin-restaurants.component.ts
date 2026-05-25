import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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
  all:     Restaurant[] = [];
  pending: Restaurant[] = [];
  activeTab: 'pending' | 'all' = 'pending';
  loading     = true;
  approvingId: number | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    forkJoin({
      all:     this.restaurantService.getAll().pipe(catchError(() => of([]))),
      pending: this.restaurantService.getPending().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => { this.loading = false; })
    ).subscribe(({ all, pending }) => {
      this.all     = all;
      this.pending = pending;
    });
  }

  approve(id: number): void {
    this.approvingId = id;
    this.restaurantService.approve(id).pipe(
      catchError(err => {
        this.toast.error(err?.error?.message || 'Could not approve.');
        this.approvingId = null;
        return of(null);
      })
    ).subscribe(updated => {
      if (!updated) return;
      this.pending     = this.pending.filter(r => r.restaurantId !== id);
      const idx        = this.all.findIndex(r => r.restaurantId === id);
      if (idx !== -1) this.all[idx] = updated;
      else this.all.push(updated);
      this.approvingId = null;
      this.toast.success(`${updated.name} approved!`);
    });
  }

  delete(id: number, name: string): void {
    if (!confirm(`Delete "${name}"?`)) return;
    this.restaurantService.delete(id).pipe(
      catchError(() => { this.toast.error('Could not delete.'); return of(null); })
    ).subscribe(res => {
      if (res === null) return;
      this.all     = this.all.filter(r => r.restaurantId !== id);
      this.pending = this.pending.filter(r => r.restaurantId !== id);
      this.toast.success('Deleted.');
    });
  }
}