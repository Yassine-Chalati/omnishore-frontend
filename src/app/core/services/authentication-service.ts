import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  authenticate(username: string, password: string): Observable<Authentication> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  const body = new URLSearchParams();
    body.set('client_id', environment.clientId);
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', environment.grantType.password);
    return this.http.post<Authentication>(environment.keycloakUrl, body, {headers});
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
    return this.http.post<Authentication>(environment.keycloakUrl, body, {headers})
  }
}
