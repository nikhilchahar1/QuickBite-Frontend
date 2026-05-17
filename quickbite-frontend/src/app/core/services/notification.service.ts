import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ReviewRequest, ReviewResponse,
  NotificationResponse, SendNotificationRequest, BulkNotificationRequest
} from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly API = `${environment.apiUrl}/api/reviews`;
  constructor(private http: HttpClient) {}

  addReview(data: ReviewRequest): Observable<ReviewResponse>            { return this.http.post<ReviewResponse>(this.API, data); }
  getByRestaurant(id: number): Observable<ReviewResponse[]>             { return this.http.get<ReviewResponse[]>(`${this.API}/restaurant/${id}`); }
  getMyReviews(): Observable<ReviewResponse[]>                          { return this.http.get<ReviewResponse[]>(`${this.API}/my`); }
  getByOrder(orderId: number): Observable<ReviewResponse>               { return this.http.get<ReviewResponse>(`${this.API}/order/${orderId}`); }
  getAllReviews(): Observable<ReviewResponse[]>                          { return this.http.get<ReviewResponse[]>(`${this.API}/all`); }
  deleteReview(id: number): Observable<string>                          { return this.http.delete<string>(`${this.API}/${id}`); }
  verifyReview(id: number): Observable<ReviewResponse>                  { return this.http.put<ReviewResponse>(`${this.API}/verify/${id}`, {}); }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API = `${environment.apiUrl}/api/notifications`;
  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<NotificationResponse[]>             { return this.http.get<NotificationResponse[]>(`${this.API}/my`); }
  getUnread(): Observable<NotificationResponse[]>                       { return this.http.get<NotificationResponse[]>(`${this.API}/my/unread`); }
  getUnreadCount(): Observable<{ count: number }>                       { return this.http.get<{ count: number }>(`${this.API}/unread-count`); }
  markAsRead(id: number): Observable<NotificationResponse>              { return this.http.put<NotificationResponse>(`${this.API}/read/${id}`, {}); }
  markAllRead(): Observable<any>                                        { return this.http.put(`${this.API}/read-all`, {}); }
  deleteNotification(id: number): Observable<any>                      { return this.http.delete(`${this.API}/delete/${id}`); }
  send(data: SendNotificationRequest): Observable<NotificationResponse>         { return this.http.post<NotificationResponse>(`${this.API}/send`, data); }
  sendBulk(data: BulkNotificationRequest): Observable<NotificationResponse[]>  { return this.http.post<NotificationResponse[]>(`${this.API}/send-bulk`, data); }
  getAll(): Observable<NotificationResponse[]>                          { return this.http.get<NotificationResponse[]>(`${this.API}/all`); }
}