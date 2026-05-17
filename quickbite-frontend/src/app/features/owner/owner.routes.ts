import { Routes } from '@angular/router';
export const OWNER_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent) }
];
