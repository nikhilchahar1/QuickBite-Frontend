import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuCategory, MenuItem, MenuItemRequest, CategoryRequest } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly API = `${environment.apiUrl}/api/menu`;
  constructor(private http: HttpClient) {}

  getCategories(restaurantId: number): Observable<MenuCategory[]>   { return this.http.get<MenuCategory[]>(`${this.API}/categories/${restaurantId}`); }
  getItemsByRestaurant(id: number): Observable<MenuItem[]>           { return this.http.get<MenuItem[]>(`${this.API}/items/restaurant/${id}`); }
  getItemsByCategory(id: number): Observable<MenuItem[]>             { return this.http.get<MenuItem[]>(`${this.API}/items/category/${id}`); }
  getItem(itemId: number): Observable<MenuItem>                      { return this.http.get<MenuItem>(`${this.API}/items/${itemId}`); }
  addCategory(data: CategoryRequest): Observable<MenuCategory>       { return this.http.post<MenuCategory>(`${this.API}/category`, data); }
  addItem(data: MenuItemRequest): Observable<MenuItem>               { return this.http.post<MenuItem>(`${this.API}/item`, data); }
  updateItem(id: number, data: MenuItemRequest): Observable<MenuItem>{ return this.http.put<MenuItem>(`${this.API}/items/${id}`, data); }
  toggleAvailability(id: number): Observable<MenuItem>               { return this.http.put<MenuItem>(`${this.API}/items/toggle/${id}`, {}); }
  deleteItem(id: number): Observable<string>                         { return this.http.delete<string>(`${this.API}/items/${id}`); }
  deleteCategory(id: number): Observable<string>                     { return this.http.delete<string>(`${this.API}/category/${id}`); }
  getVegItems(restaurantId: number): Observable<MenuItem[]>          { return this.http.get<MenuItem[]>(`${this.API}/items/veg/${restaurantId}`); }
}