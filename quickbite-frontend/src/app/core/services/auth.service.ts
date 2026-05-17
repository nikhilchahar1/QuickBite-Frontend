import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = 'qb_token';
  private readonly USER_KEY  = 'qb_user';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/api/auth/register`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/api/auth/login`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this.currentUserSubject.next(res);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  getCurrentUser(): AuthResponse | null { return this.currentUserSubject.value; }
  getRole(): string | null { return this.getCurrentUser()?.role || null; }
  getUserId(): number | null { return this.getCurrentUser()?.userId || null; }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isCustomer(): boolean { return this.getRole() === 'CUSTOMER'; }
  isOwner(): boolean { return this.getRole() === 'OWNER'; }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isAgent(): boolean { return this.getRole() === 'AGENT'; }

  redirectByRole(): void {
    const role = this.getRole();
    if (role === 'ADMIN')  this.router.navigate(['/admin']);
    else if (role === 'OWNER') this.router.navigate(['/owner']);
    else this.router.navigate(['/']);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/api/auth/users/all`);
  }

  changeRole(email: string, role: string): Observable<any> {
    return this.http.post(`${this.API}/api/auth/admin/change-role`, { email, role });
  }
}