import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddItemRequest, CartResponse, UpdateQuantityRequest } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = `${environment.apiUrl}/api/cart`;
  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.API).pipe(tap(c => this.cartSubject.next(c)));
  }
  addItem(data: AddItemRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.API}/add`, data).pipe(tap(c => this.cartSubject.next(c)));
  }
  removeItem(cartItemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API}/remove/${cartItemId}`).pipe(tap(c => this.cartSubject.next(c)));
  }
  updateQuantity(data: UpdateQuantityRequest): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.API}/update-quantity`, data).pipe(tap(c => this.cartSubject.next(c)));
  }
  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API}/clear`).pipe(tap(c => this.cartSubject.next(c)));
  }
  applyPromo(promoCode: string): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.API}/promo`, { promoCode }).pipe(tap(c => this.cartSubject.next(c)));
  }
  removePromo(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API}/promo`).pipe(tap(c => this.cartSubject.next(c)));
  }
  switchRestaurant(restaurantId: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.API}/switch-restaurant/${restaurantId}`, {}).pipe(tap(c => this.cartSubject.next(c)));
  }
  clearLocal(): void { this.cartSubject.next(null); }
}