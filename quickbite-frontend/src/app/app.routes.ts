import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'restaurants', loadComponent: () => import('./features/restaurant/list/restaurant-list.component').then(m => m.RestaurantListComponent) },
  { path: 'restaurants/:id', loadComponent: () => import('./features/restaurant/detail/restaurant-detail.component').then(m => m.RestaurantDetailComponent) },
  { path: 'oauth2/callback', loadComponent: () => import('./features/auth/oauth-callback/oauth-callback.component').then(m => m.OAuthCallbackComponent)},
  // Customer
  { path: 'cart', canActivate: [authGuard, roleGuard], data: { roles: ['CUSTOMER'] }, loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', canActivate: [authGuard, roleGuard], data: { roles: ['CUSTOMER'] }, loadComponent: () => import('./features/order/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', canActivate: [authGuard, roleGuard], data: { roles: ['CUSTOMER'] }, loadComponent: () => import('./features/order/history/order-history.component').then(m => m.OrderHistoryComponent) },
  { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('./features/order/tracking/order-tracking.component').then(m => m.OrderTrackingComponent) },
  { path: 'wallet', canActivate: [authGuard, roleGuard], data: { roles: ['CUSTOMER'] }, loadComponent: () => import('./features/payment/wallet/wallet.component').then(m => m.WalletComponent) },
  { path: 'notifications', canActivate: [authGuard], loadComponent: () => import('./features/notification/notification.component').then(m => m.NotificationComponent) },
  { path: 'review/:orderId', canActivate: [authGuard, roleGuard], data: { roles: ['CUSTOMER'] }, loadComponent: () => import('./features/review/review.component').then(m => m.ReviewComponent) },

  // Owner
  { path: 'owner', canActivate: [authGuard, roleGuard], data: { roles: ['OWNER'] }, loadComponent: () => import('./features/dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent) },
  { path: 'owner/restaurant/new', canActivate: [authGuard, roleGuard], data: { roles: ['OWNER'] }, loadComponent: () => import('./features/owner/restaurant-manage/restaurant-manage.component').then(m => m.RestaurantManageComponent) },
  { path: 'owner/restaurant/:id', canActivate: [authGuard, roleGuard], data: { roles: ['OWNER'] }, loadComponent: () => import('./features/owner/restaurant-manage/restaurant-manage.component').then(m => m.RestaurantManageComponent) },
  { path: 'owner/menu/:restaurantId', canActivate: [authGuard, roleGuard], data: { roles: ['OWNER'] }, loadComponent: () => import('./features/owner/menu-manage/menu-manage.component').then(m => m.MenuManageComponent) },
  { path: 'owner/orders', canActivate: [authGuard, roleGuard], data: { roles: ['OWNER'] }, loadComponent: () => import('./features/owner/orders/owner-orders.component').then(m => m.OwnerOrdersComponent) },

  // Admin
  { path: 'admin', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/users', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
  { path: 'admin/restaurants', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./features/admin/restaurants/admin-restaurants.component').then(m => m.AdminRestaurantsComponent) },
  { path: 'admin/orders', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
  { path: 'admin/reviews', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./features/admin/reviews/admin-reviews.component').then(m => m.AdminReviewsComponent) },
  { path: 'admin/notifications', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, loadComponent: () => import('./features/admin/notifications/admin-notifications.component').then(m => m.AdminNotificationsComponent) },

  { path: '**', redirectTo: '' }
];