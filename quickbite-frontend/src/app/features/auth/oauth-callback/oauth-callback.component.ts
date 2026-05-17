import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-page">
      <div class="callback-box" *ngIf="!error">
        <div class="oauth-spinner"></div>
        <h3>Signing you in with Google...</h3>
        <p>Please wait a moment</p>
      </div>

      <div class="callback-box error-box" *ngIf="error">
        <div class="error-icon">❌</div>
        <h3>Login Failed</h3>
        <p>{{ errorMsg }}</p>
        <button class="btn btn-primary mt-4" (click)="goToLogin()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .callback-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--secondary-dark), var(--secondary));
    }
    .callback-box {
      background: white;
      border-radius: var(--radius-xl);
      padding: 48px 40px;
      text-align: center;
      max-width: 360px;
      width: 100%;
      box-shadow: var(--shadow-xl);
    }
    .oauth-spinner {
      width: 52px; height: 52px;
      border: 4px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 24px;
    }
    h3 { font-size: 1.2rem; margin-bottom: 8px; }
    p  { color: var(--text-muted); font-size: 0.9rem; }
    .error-box { border-top: 4px solid var(--error); }
    .error-icon { font-size: 2.5rem; margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  error    = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Check for OAuth failure redirect
    const urlError = this.route.snapshot.queryParams['error'];
    if (urlError) {
      this.error    = true;
      this.errorMsg = 'Google login was cancelled or failed. Please try again.';
      return;
    }

    // Read token from URL ?token=xxx
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.error    = true;
      this.errorMsg = 'No authentication token received. Please try again.';
      return;
    }

    // Validate token with backend to get full user info
    this.http.post<any>(
      `${environment.apiUrl}/api/auth/validate`,
      { token }
    ).subscribe({
      next: (res) => {
        if (res.valid) {
          // Manually build AuthResponse and save session
          const authResponse = {
            token:    token,
            role:     res.role,
            email:    res.email,
            fullName: res.email.split('@')[0], // fallback name
            userId:   res.userId,
            message:  'Google login successful'
          };

          // Use the private saveSession workaround via login trick
          // We store directly since we already have the validated token
          localStorage.setItem('qb_token', token);
          localStorage.setItem('qb_user', JSON.stringify(authResponse));

          // Trigger currentUser$ update
          (this.auth as any).currentUserSubject.next(authResponse);

          this.toast.success('Welcome! Signed in with Google 🎉');
          this.auth.redirectByRole();
        } else {
          this.error    = true;
          this.errorMsg = 'Token validation failed. Please try again.';
        }
      },
      error: () => {
        this.error    = true;
        this.errorMsg = 'Could not verify your session. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}