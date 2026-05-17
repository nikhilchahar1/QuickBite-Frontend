import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles: string[] = route.data?.['roles'] || [];

  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }

  const userRole = auth.getRole();
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
    router.navigate(['/']); return false;
  }
  return true;
};