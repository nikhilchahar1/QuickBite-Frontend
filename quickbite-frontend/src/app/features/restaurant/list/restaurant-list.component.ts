import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Restaurant } from '../../../shared/models/models';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  allRestaurants: Restaurant[]      = [];
  filteredRestaurants: Restaurant[] = [];
  loading = false;
  error   = '';

  searchQuery     = '';
  selectedCity    = '';
  selectedCuisine = '';
  selectedSort    = 'rating';
  showOpenOnly    = false;

  cities   = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Agra', 'Mathura'];
  cuisines = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Continental', 'Fast Food'];
  sortOptions = [
    { value: 'rating',   label: 'Top Rated' },
    { value: 'delivery', label: 'Fastest Delivery' },
    { value: 'name',     label: 'A → Z' },
  ];

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Read query params from URL first
    this.route.queryParams.subscribe(params => {
      this.searchQuery     = params['search']  || '';
      this.selectedCuisine = params['cuisine'] || '';
      this.selectedCity    = params['city']    || '';
      this.loadAll();
    });
  }

  private loadAll(): void {
    this.loading = true;
    this.error   = '';

    this.restaurantService.getAll().pipe(
      catchError(err => {
        this.error = 'Could not load restaurants. Make sure the backend is running.';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        // ✅ KEY FIX: Always apply filters after load completes
        // whether success or error — this populates filteredRestaurants
        this.applyFilters();
      })
    ).subscribe(list => {
      this.allRestaurants = list;
    });
  }

  applyFilters(): void {
    let result = [...this.allRestaurants];

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q)     ||
        r.cuisine.toLowerCase().includes(q)  ||
        r.city.toLowerCase().includes(q)
      );
    }

    // City filter
    if (this.selectedCity) {
      result = result.filter(r =>
        r.city.toLowerCase() === this.selectedCity.toLowerCase()
      );
    }

    // Cuisine filter
    if (this.selectedCuisine) {
      result = result.filter(r =>
        r.cuisine.toLowerCase() === this.selectedCuisine.toLowerCase()
      );
    }

    // Open only
    if (this.showOpenOnly) {
      result = result.filter(r => r.open);
    }

    // Sort
    switch (this.selectedSort) {
      case 'rating':
        result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'delivery':
        result.sort((a, b) => (a.estimatedDeliveryMin || 30) - (b.estimatedDeliveryMin || 30));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.filteredRestaurants = result;
  }

  clearFilters(): void {
    this.searchQuery     = '';
    this.selectedCity    = '';
    this.selectedCuisine = '';
    this.showOpenOnly    = false;
    this.selectedSort    = 'rating';
    this.applyFilters();
    this.router.navigate(['/restaurants']);
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedCity ||
              this.selectedCuisine || this.showOpenOnly);
  }
}