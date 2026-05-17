import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  users: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchQuery = '';
  selectedRole = '';
  changingRoleFor: string | null = null;

  roles = ['CUSTOMER', 'OWNER', 'AGENT', 'ADMIN'];

  constructor(private authService: AuthService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: users => { this.users = users; this.filter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filter(): void {
    let result = [...this.users];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }
    if (this.selectedRole) result = result.filter(u => u.role === this.selectedRole);
    this.filtered = result;
  }

  changeRole(email: string, newRole: string): void {
    this.changingRoleFor = email;
    this.authService.changeRole(email, newRole).subscribe({
      next: () => {
        const u = this.users.find(x => x.email === email);
        if (u) u.role = newRole;
        this.filter();
        this.changingRoleFor = null;
        this.toast.success(`Role updated to ${newRole}`);
      },
      error: (err) => {
        this.changingRoleFor = null;
        this.toast.error(err?.error?.message || 'Could not change role.');
      }
    });
  }
}