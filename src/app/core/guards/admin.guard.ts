import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';
import { AuthService } from './auth.guard';
import { jwtDecode } from 'jwt-decode';
import { Observable, of, switchMap, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuardService {
  constructor(private authService: AuthenticationService) {}

  hasRole(token: string, role: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const roles = decoded?.resource_access?.['omnishore-cv']?.roles || [];
      return roles.includes(role);
    } catch {
      return false;
    }
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const authService = inject(AuthService);
  const roleService = inject(RoleGuardService);

  // Must be authenticated first
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const accessToken = authService.getToken();
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh-token') : null;

  // Check if token is expired
  let isExpired = false;
  try {
    const decoded: any = jwtDecode(accessToken!);
    isExpired = decoded.exp * 1000 < Date.now();
  } catch {
    isExpired = true;
  }

  if (!isExpired && roleService.hasRole(accessToken!, 'ROLE_ADMIN')) {
    return true;
  }

  // If expired, try refresh
  if (isExpired && refreshToken) {
    return authenticationService.authenticateWithRefreshToken().pipe(
      switchMap((auth: any) => {
        authService.setToken(auth.access_token);
        localStorage.setItem('refresh-token', auth.refresh_token);
        if (roleService.hasRole(auth.access_token, 'ROLE_ADMIN')) {
          return of(true);
        } else {
          router.navigate(['/login']);
          return of(false);
        }
      }),
      catchError(() => {
        router.navigate(['/login']);
        return of(false);
      })
    );
  }

  router.navigate(['/login']);
  return false;
};
