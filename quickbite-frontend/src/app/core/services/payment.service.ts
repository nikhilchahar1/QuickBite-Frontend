import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateOrderRequest, CreateOrderResponse, VerifyPaymentRequest,
  PaymentResponse, WalletTopUpRequest, WalletResponse, WalletStatementResponse
} from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly API = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createRazorpayOrder(data: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.API}/api/payments/razorpay/create-order`, data);
  }
  verifyPayment(data: VerifyPaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.API}/api/payments/razorpay/verify`, data);
  }
  codPayment(orderId: number, amount: number): Observable<PaymentResponse> {
    const params = new HttpParams().set('orderId', orderId).set('amount', amount);
    return this.http.post<PaymentResponse>(`${this.API}/api/payments/cod`, null, { params });
  }
  walletPay(orderId: number, amount: number): Observable<PaymentResponse> {
    const params = new HttpParams().set('orderId', orderId).set('amount', amount);
    return this.http.post<PaymentResponse>(`${this.API}/api/payments/wallet/pay`, null, { params });
  }
  refund(orderId: number): Observable<PaymentResponse>     { return this.http.post<PaymentResponse>(`${this.API}/api/payments/refund/${orderId}`, {}); }
  getMyPayments(): Observable<PaymentResponse[]>           { return this.http.get<PaymentResponse[]>(`${this.API}/api/payments/my`); }
  getAllPayments(): Observable<PaymentResponse[]>           { return this.http.get<PaymentResponse[]>(`${this.API}/api/payments/all`); }
  getWalletBalance(): Observable<WalletResponse>           { return this.http.get<WalletResponse>(`${this.API}/api/wallet/balance`); }
  topUpWallet(data: WalletTopUpRequest): Observable<WalletResponse>     { return this.http.post<WalletResponse>(`${this.API}/api/wallet/add`, data); }
  getWalletStatements(): Observable<WalletStatementResponse[]>          { return this.http.get<WalletStatementResponse[]>(`${this.API}/api/wallet/statements`); }
}