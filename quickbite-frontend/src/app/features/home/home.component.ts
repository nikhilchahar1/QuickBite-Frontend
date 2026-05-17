import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { Restaurant } from '../../shared/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredRestaurants: Restaurant[] = [];
  loading     = false;
  searchQuery = '';

  cuisines = [
    { name: 'Indian',      emoji: '🍛' },
    { name: 'Chinese',     emoji: '🥡' },
    { name: 'Italian',     emoji: '🍝' },
    { name: 'Mexican',     emoji: '🌮' },
    { name: 'Thai',        emoji: '🍜' },
    { name: 'Japanese',    emoji: '🍱' },
    { name: 'Continental', emoji: '🥩' },
    { name: 'Fast Food',   emoji: '🍔' },
  ];

  stats = [
    { label: 'Restaurants',  value: '500+',  icon: '🏪' },
    { label: 'Happy Customers', value: '50K+', icon: '😊' },
    { label: 'Cities',       value: '25+',   icon: '🌆' },
    { label: 'Daily Orders', value: '10K+',  icon: '🛵' },
  ];

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void { this.loadFeatured(); }

  private loadFeatured(): void {
    this.loading = true;
    this.restaurantService.getAll().subscribe({
      next: list => { this.featuredRestaurants = list.slice(0, 8); this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/restaurants'], { queryParams: { search: this.searchQuery.trim() } });
    }
  }

  onCuisine(name: string): void {
    this.router.navigate(['/restaurants'], { queryParams: { cuisine: name } });
  }

  getRatingStars(rating: number): string {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
}