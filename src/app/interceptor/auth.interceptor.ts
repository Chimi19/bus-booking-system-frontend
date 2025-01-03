import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Exclude refresh-token and login endpoints from adding access token
  const excludedUrls = ['auth/refresh-token', 'auth/login','auth/sign-up'];
  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  // Get the access token
  const token = authService.getToken();
  console.log('Retrieved Token:', token);


  // If token exists, clone the request and add Authorization header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Cloned Request with Auth Header:', authReq);

    return next(authReq).pipe(
      catchError(error => {
        // Handle 401 (Unauthorized) errors
        if (error.status === 401) {
          // Attempt to refresh token 
          return authService.refreshToken().pipe(
            switchMap((newTokenResponse: any) => {
              // Clone the request with the new token
              console.log('New Token Response:', newTokenResponse);
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokenResponse?.accessToken}`
                }
              });
              
              // Retry the original request
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // If refresh fails, logout and redirect to login
               // If refresh fails, logout and redirect to login
               console.log('Token refresh failed:', refreshError);
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }
        
        // For other errors, rethrow
        return throwError(() => error);
      })
    );
  }

  // If no token, proceed with the original request
  return next(req);
};
