import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email    = '';
  password = '';
  loading  = false;
  error    = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  onLogin(): void {
    if (!this.email.trim() || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }
    this.error   = '';
    this.loading = true;

    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toast.success(`Welcome back, ${res.fullName}! 👋`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) this.router.navigateByUrl(returnUrl);
        else this.auth.redirectByRole();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid email or password.';
      }
    });
  }
  // Add this inside LoginComponent class (after the onLogin method)

  signInWithGoogle(): void {
    // Step 1: Ask backend for the Google OAuth URL
    this.http.get<{ url: string }>(
      `${environment.apiUrl}/api/auth/oauth2/google-url`
    ).subscribe({
      next: (res) => {
        // Step 2: Redirect browser to Google login
        window.location.href = res.url;
      },
      error: () => {
        this.error = 'Could not initiate Google login. Make sure backend is running.';
      }
    });
  }
}