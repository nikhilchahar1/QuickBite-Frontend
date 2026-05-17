import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../core/services/notification.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  orderId     = 0;
  restaurantId = 0;
  loading     = true;
  submitting  = false;
  alreadyReviewed = false;

  foodRating     = 0;
  deliveryRating = 0;
  comment        = '';

  hoveredFood     = 0;
  hoveredDelivery = 0;

  stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.checkOrder();
  }

  private checkOrder(): void {
    this.orderService.getById(this.orderId).subscribe({
      next: order => {
        if (order.orderStatus !== 'DELIVERED') {
          this.toast.warning('You can only review delivered orders.');
          this.router.navigate(['/orders', this.orderId]);
          return;
        }
        this.restaurantId = order.restaurantId;
        this.checkExistingReview();
      },
      error: () => { this.loading = false; this.router.navigate(['/orders']); }
    });
  }

  private checkExistingReview(): void {
    this.reviewService.getByOrder(this.orderId).subscribe({
      next: () => { this.alreadyReviewed = true; this.loading = false; },
      error: ()  => { this.loading = false; } // 404 = not reviewed yet, good
    });
  }

  submit(): void {
    if (this.foodRating === 0) {
      this.toast.error('Please rate the food.');
      return;
    }
    this.submitting = true;
    this.reviewService.addReview({
      restaurantId:   this.restaurantId,
      orderId:        this.orderId,
      foodRating:     this.foodRating,
      deliveryRating: this.deliveryRating || undefined,
      comment:        this.comment.trim() || undefined
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.toast.success('Review submitted! Thank you 🎉');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.error(err?.error?.message || 'Could not submit review.');
      }
    });
  }

  getFoodLabel(): string {
    const r = this.hoveredFood || this.foodRating;
    return ['', 'Terrible 😞', 'Poor 😕', 'Okay 😐', 'Good 😊', 'Excellent 🤩'][r] || '';
  }

  getDeliveryLabel(): string {
    const r = this.hoveredDelivery || this.deliveryRating;
    return ['', 'Very Slow 🐢', 'Slow 😕', 'Okay ⏱', 'Fast 😊', 'Lightning Fast ⚡'][r] || '';
  }
}