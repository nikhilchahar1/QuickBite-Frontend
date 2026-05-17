import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        // Token expired or invalid — force logout
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { reason: 'session_expired' }
        });
      }

      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      // Extract backend error message if available
      const message =
        error.error?.message ||
        error.error?.error ||
        error.message ||
        'Something went wrong. Please try again.';

      return throwError(() => new Error(message));
    })
  );
};
