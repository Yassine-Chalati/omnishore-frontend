
// removed duplicate forkJoin import
// removed duplicate revokeAllTokens
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Authentication } from '../models/Authentication';
import { environment } from '../configurations/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Revoke a token (access or refresh) using Keycloak's revocation endpoint.
   * @param token The token to revoke
   * @param tokenType 'refresh_token' or 'access_token'
   */
  revokeToken(access_token: string, refresh_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    body.set('client_id', environment.clientId);
    // Only set client_secret if present in environment
    body.set('refresh_token', refresh_token);
    body.set('access_token', access_token);
    // Keycloak revocation endpoint
    const revokeUrl = environment.keycloakUrl + "/logout";
    return this.http.post(revokeUrl, body, { headers });
  }

    /**
   * Revoke both access and refresh tokens in parallel (if present in localStorage)
   */
  revokeAllTokens(): Observable<any> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return new Observable(observer => { observer.complete(); });
    }
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh-token');
    const revokes = [];
    if (accessToken && refreshToken) {
      revokes.push(this.revokeToken(accessToken, refreshToken));
    }
    if (revokes.length === 0) {
      return new Observable(observer => { observer.complete(); });
    }
    return forkJoin(revokes);
  }

  logout(): Observable<any> {
    // Revoke tokens first, then clear from localStorage
    return new Observable(observer => {
      this.revokeAllTokens().subscribe({
        complete: () => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh-token');
          }
          observer.next(null);
          observer.complete();
        },
        error: (err) => {
          // Still clear tokens even if revoke fails
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh-token');
          }
          observer.error(err);
        }
      });
    });
  }

  authenticate(username: string, password: string): Observable<Authentication> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  const body = new URLSearchParams();
    body.set('client_id', environment.clientId);
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', environment.grantType.password);
    return this.http.post<Authentication>(environment.keycloakUrl + "/token", body, {headers});
  }

  authenticateWithRefreshToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    const refreshToken = localStorage.getItem('refresh-token')
    body.set('client_id', environment.clientId);
    body.set('refresh_token', refreshToken!);
    body.set('grant_type', environment.grantType.refreshToken);
    return this.http.post<Authentication>(environment.keycloakUrl + "/token", body, {headers})
  }
}
