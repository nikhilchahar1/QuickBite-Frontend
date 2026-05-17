import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { RestaurantRequest } from '../../../shared/models/models';

@Component({
  selector: 'app-restaurant-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  templateUrl: './restaurant-manage.component.html',
  styleUrls: ['./restaurant-manage.component.scss']
})
export class RestaurantManageComponent implements OnInit {
  isEdit   = false;
  editId   = 0;
  loading  = false;
  saving   = false;

  form: RestaurantRequest = {
    name: '', cuisine: '', address: '', city: '',
    description: '', phone: '', imageUrl: '',
    deliveryRadius: 5, minOrderAmount: 0, estimatedDeliveryMin: 30
  };

  cuisines = ['Indian','Chinese','Italian','Mexican','Thai','Japanese','Continental','Fast Food','Bakery','Beverages'];
  cities   = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Pune','Agra','Kolkata','Jaipur','Surat'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = Number(id);
      this.loading = true;
      this.restaurantService.getById(this.editId).subscribe({
        next: r => {
          this.form = {
            name: r.name, cuisine: r.cuisine,
            address: r.address, city: r.city,
            description: r.description, phone: r.phone || '',
            imageUrl: r.imageUrl || '',
            deliveryRadius: r.deliveryRadius,
            minOrderAmount: r.minOrderAmount,
            estimatedDeliveryMin: r.estimatedDeliveryMin
          };
          this.loading = false;
        },
        error: () => { this.loading = false; this.router.navigate(['/owner']); }
      });
    }
  }

  save(): void {
    if (!this.form.name.trim() || !this.form.cuisine || !this.form.city || !this.form.address.trim()) {
      this.toast.error('Name, cuisine, city and address are required.');
      return;
    }
    this.saving = true;
    const obs = this.isEdit
      ? this.restaurantService.update(this.editId, this.form)
      : this.restaurantService.register(this.form);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Restaurant updated!' : 'Restaurant registered! Awaiting admin approval.');
        this.router.navigate(['/owner']);
      },
      error: (err) => {
        this.saving = false;
        this.toast.error(err?.error?.message || 'Could not save restaurant.');
      }
    });
  }
}