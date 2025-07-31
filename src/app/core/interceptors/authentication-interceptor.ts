import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, switchMap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  console.log('Intercepting request:', req);

  // Do not intercept login, refresh, or revoke requests
  if (req.url.includes('/token') || req.url.includes('/revoke')) {
    console.log('Skipping interception for:', req.url);
    return next(req);
  }

  // Always read the latest access and refresh tokens from localStorage
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    accessToken = localStorage.getItem('access_token');
    refreshToken = localStorage.getItem('refresh-token');
    console.log('Retrieved tokens:', { accessToken, refreshToken });
  }

  if (accessToken) {
    console.log('Adding Authorization header with access token');
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed with error:', error);
        if (error.status === 401 && refreshToken) {
          console.log('Attempting to refresh token');
          return authService.authenticateWithRefreshToken().pipe(
            switchMap((result: any) => {
              console.log('Token refresh result:', result);
              if (result && result.access_token) {
                localStorage.setItem('access_token', result.access_token);
                if (result.refresh_token) {
                  localStorage.setItem('refresh-token', result.refresh_token);
                }
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${result.access_token}` }
                });
                console.log('Retrying original request with new token');
                return next(retryReq);
              } else {
                console.error('Token refresh failed, navigating to login');
                router.navigate(['/login']);
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              console.error('Token refresh error:', refreshError);
              router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  } else if (refreshToken) {
    console.log('No access token, attempting to refresh token');
    return authService.authenticateWithRefreshToken().pipe(
      switchMap((result: any) => {
        console.log('Token refresh result:', result);
        if (result && result.access_token) {
          localStorage.setItem('access_token', result.access_token);
          if (result.refresh_token) {
            localStorage.setItem('refresh-token', result.refresh_token);
          }
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${result.access_token}` }
          });
          console.log('Retrying original request with new token');
          return next(retryReq);
        } else {
          console.error('Token refresh failed, navigating to login');
          router.navigate(['/login']);
          return throwError(() => new Error('Unable to refresh token'));
        }
      }),
      catchError((refreshError) => {
        console.error('Token refresh error:', refreshError);
        router.navigate(['/login']);
        return throwError(() => new Error('Unable to refresh token'));
      })
    );
  } else {
    console.log('No tokens available, proceeding unauthenticated');
    return next(req);
  }
};
