import { Routes } from '@angular/router';
export const AGENT_ROUTES: Routes = [
  { path: 'dashboard', loadComponent: () => import('./agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent) }
];
