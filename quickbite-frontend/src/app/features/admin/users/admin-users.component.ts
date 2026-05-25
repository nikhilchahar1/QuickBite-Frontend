import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: any[]    = [];
  filtered: any[] = [];
  loading         = true;
  searchQuery     = '';
  selectedRole    = '';
  changingRoleFor: string | null = null;

  roles = ['CUSTOMER', 'OWNER', 'AGENT', 'ADMIN'];

  constructor(
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().pipe(
      catchError(() => {
        this.toast.error('Could not load users.');
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.filter(); // ✅ always filter after load
      })
    ).subscribe(users => {
      this.users = users;
    });
  }

  filter(): void {
    let result = [...this.users];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result  = result.filter(u =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    if (this.selectedRole) {
      result = result.filter(u => u.role === this.selectedRole);
    }
    this.filtered = result;
  }

  changeRole(email: string, newRole: string): void {
    this.changingRoleFor = email;
    this.authService.changeRole(email, newRole).pipe(
      catchError(err => {
        this.toast.error(err?.error?.message || 'Could not change role.');
        return of(null);
      }),
      finalize(() => { this.changingRoleFor = null; })
    ).subscribe(res => {
      if (!res) return;
      const u = this.users.find(x => x.email === email);
      if (u) { u.role = newRole; this.filter(); }
      this.toast.success(`Role updated to ${newRole}`);
    });
  }
}