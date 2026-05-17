import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { MenuCategory, MenuItem, MenuItemRequest } from '../../../shared/models/models';

@Component({
  selector: 'app-menu-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  templateUrl: './menu-manage.component.html',
  styleUrls: ['./menu-manage.component.scss']
})
export class MenuManageComponent implements OnInit {
  restaurantId = 0;
  categories: MenuCategory[] = [];
  items: MenuItem[] = [];
  loading = false;

  // Category form
  showCatForm = false;
  catName = '';
  savingCat = false;

  // Item form
  showItemForm = false;
  editingItem: MenuItem | null = null;
  itemForm: MenuItemRequest = this.emptyItemForm();
  savingItem = false;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('restaurantId'));
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.menuService.getCategories(this.restaurantId).subscribe(cats => {
      this.categories = cats;
      this.menuService.getItemsByRestaurant(this.restaurantId).subscribe(items => {
        this.items = items;
        this.loading = false;
      });
    });
  }

  getItemsForCategory(categoryId: number): MenuItem[] {
    return this.items.filter(i => i.categoryId === categoryId);
  }

  addCategory(): void {
    if (!this.catName.trim()) return;
    this.savingCat = true;
    this.menuService.addCategory({ restaurantId: this.restaurantId, name: this.catName.trim() }).subscribe({
      next: cat => {
        this.categories.push(cat);
        this.catName = ''; this.showCatForm = false; this.savingCat = false;
        this.toast.success('Category added!');
      },
      error: () => { this.savingCat = false; }
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category and all its items?')) return;
    this.menuService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.categoryId !== id);
        this.items = this.items.filter(i => i.categoryId !== id);
        this.toast.success('Category deleted.');
      }
    });
  }

  openAddItem(categoryId: number): void {
    this.editingItem = null;
    this.itemForm = this.emptyItemForm();
    this.itemForm.categoryId = categoryId;
    this.showItemForm = true;
  }

  openEditItem(item: MenuItem): void {
    this.editingItem = item;
    this.itemForm = {
      restaurantId: this.restaurantId,
      categoryId:   item.categoryId,
      name:         item.name,
      description:  item.description || '',
      price:        item.price,
      discountedPrice: item.discountedPrice,
      imageUrl:     item.imageUrl || '',
      veg:          item.veg,
      calories:     item.calories,
      tags:         item.tags || ''
    };
    this.showItemForm = true;
  }

  saveItem(): void {
    if (!this.itemForm.name.trim() || !this.itemForm.price) {
      this.toast.error('Name and price are required.');
      return;
    }
    this.savingItem = true;
    this.itemForm.restaurantId = this.restaurantId;

    const obs = this.editingItem
      ? this.menuService.updateItem(this.editingItem.itemId, this.itemForm)
      : this.menuService.addItem(this.itemForm);

    obs.subscribe({
      next: saved => {
        if (this.editingItem) {
          const idx = this.items.findIndex(i => i.itemId === this.editingItem!.itemId);
          if (idx !== -1) this.items[idx] = saved;
        } else {
          this.items.push(saved);
        }
        this.savingItem = false;
        this.showItemForm = false;
        this.toast.success(this.editingItem ? 'Item updated!' : 'Item added!');
      },
      error: () => { this.savingItem = false; }
    });
  }

  toggleItem(item: MenuItem): void {
    this.menuService.toggleAvailability(item.itemId).subscribe({
      next: updated => {
        const idx = this.items.findIndex(i => i.itemId === updated.itemId);
        if (idx !== -1) this.items[idx] = updated;
        this.toast.success(`${updated.name} is now ${updated.available ? 'Available' : 'Unavailable'}`);
      }
    });
  }

  deleteItem(id: number): void {
    if (!confirm('Delete this item?')) return;
    this.menuService.deleteItem(id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.itemId !== id);
        this.toast.success('Item deleted.');
      }
    });
  }

  private emptyItemForm(): MenuItemRequest {
    return { restaurantId: this.restaurantId, categoryId: 0, name: '', price: 0, veg: false };
  }
}