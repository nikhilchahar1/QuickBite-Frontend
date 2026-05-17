import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  phone = '';

  loading = false;
  error = '';
  showPassword = false;

  get strengthWidth(): string {
    const len = this.password.length;
    if (len === 0) return '0%';
    if (len < 6)  return '25%';
    if (len < 10) return '60%';
    return '100%';
  }

  get strengthClass(): string {
    const len = this.password.length;
    if (len < 6)  return 'weak';
    if (len < 10) return 'medium';
    return 'strong';
  }

  get strengthLabel(): string {
    const len = this.password.length;
    if (len < 6)  return 'Too short';
    if (len < 10) return 'Good';
    return 'Strong ✓';
  }

  constructor(private auth: AuthService, private toast: ToastService) {}

  onRegister(): void {
    if (!this.fullName.trim() || !this.email.trim() || !this.password.trim()) {
      this.error = 'Full name, email and password are required.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    this.error   = '';
    this.loading = true;

    this.auth.register({
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password,
      phone: this.phone.trim() || undefined
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toast.success(`Welcome to QuickBite, ${res.fullName}! 🎉`);
        this.auth.redirectByRole();   // goes to / for CUSTOMER
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Email may already be in use.';
      }
    });
  }
}