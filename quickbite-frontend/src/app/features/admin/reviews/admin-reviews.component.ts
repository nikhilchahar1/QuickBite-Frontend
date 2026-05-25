import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReviewService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ReviewResponse } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss']
})
export class AdminReviewsComponent implements OnInit {
  reviews: ReviewResponse[] = [];
  loading = true;

  constructor(
    private reviewService: ReviewService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.reviewService.getAllReviews().pipe(
      catchError(() => of([])),
      finalize(() => { this.loading = false; }) // ✅ always stops
    ).subscribe(r => { this.reviews = r; });
  }

  delete(id: number): void {
    if (!confirm('Delete this review?')) return;
    this.reviewService.deleteReview(id).pipe(
      catchError(() => { this.toast.error('Could not delete.'); return of(null); })
    ).subscribe(res => {
      if (res === null) return;
      this.reviews = this.reviews.filter(r => r.reviewId !== id);
      this.toast.success('Review deleted.');
    });
  }

  verify(id: number): void {
    this.reviewService.verifyReview(id).pipe(
      catchError(() => of(null))
    ).subscribe(updated => {
      if (!updated) return;
      const idx = this.reviews.findIndex(r => r.reviewId === id);
      if (idx !== -1) this.reviews[idx] = updated;
      this.toast.success('Review verified.');
    });
  }

  stars(n: number): string { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}