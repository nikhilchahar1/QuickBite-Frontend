import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';

export const timeoutInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  return next(req).pipe(
    timeout(10000), // 10 seconds max per request
    catchError(err => {
      if (err instanceof TimeoutError) {
        console.error('Request timed out:', req.url);
        return throwError(() => ({
          error: { message: 'Request timed out. Is the backend running?' }
        }));
      }
      return throwError(() => err);
    })
  );
};