import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, PlaceOrderRequest, UpdateStatusRequest } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = `${environment.apiUrl}/api/orders`;
  constructor(private http: HttpClient) {}

  placeOrder(data: PlaceOrderRequest): Observable<OrderResponse>          { return this.http.post<OrderResponse>(`${this.API}/place`, data); }
  getById(id: number): Observable<OrderResponse>                          { return this.http.get<OrderResponse>(`${this.API}/${id}`); }
  getMyOrders(): Observable<OrderResponse[]>                              { return this.http.get<OrderResponse[]>(`${this.API}/my`); }
  getRestaurantOrders(rId: number): Observable<OrderResponse[]>          { return this.http.get<OrderResponse[]>(`${this.API}/restaurant/${rId}`); }
  getIncomingOrders(rId: number): Observable<OrderResponse[]>            { return this.http.get<OrderResponse[]>(`${this.API}/restaurant/${rId}/incoming`); }
  getAllOrders(): Observable<OrderResponse[]>                             { return this.http.get<OrderResponse[]>(`${this.API}/all`); }
  updateStatus(orderId: number, data: UpdateStatusRequest): Observable<OrderResponse> { return this.http.put<OrderResponse>(`${this.API}/status/${orderId}`, data); }
  cancelOrder(orderId: number): Observable<OrderResponse>                { return this.http.put<OrderResponse>(`${this.API}/cancel/${orderId}`, {}); }
  reorder(orderId: number): Observable<OrderResponse>                    { return this.http.post<OrderResponse>(`${this.API}/reorder/${orderId}`, {}); }
}