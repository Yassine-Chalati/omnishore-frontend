
import { Component, OnInit } from '@angular/core';
import { LoginComponent } from "../../components/login-component/login-component";
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../../core/components/toast-component/toast-component';
import { AuthenticationService } from '../../../../../core/services/authentication-service';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-container',
  imports: [CommonModule, LoginComponent, ToastComponent],
  templateUrl: './login-container.html',
  styleUrl: './login-container.css'
})
export class LoginContainer implements OnInit {
  loading = false;
  toasts: { id: number; message: string; color: string }[] = [];
  private toastId = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // If already authenticated, redirect to /admin/cv (browser only)
    if (typeof window !== 'undefined' && window.localStorage) {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        this.router.navigate(['/admin/cv']);
      }
    }
  }

  onLogin(credentials: { username: string; password: string }) {
    this.loading = true;
    this.authenticationService.authenticate(credentials.username, credentials.password)
      .pipe(
        finalize(() => this.loading = false),
        catchError((err) => {
          this.toasts.push({ id: ++this.toastId, message: 'Login failed. Please try again.', color: 'error' });
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          // Store tokens in localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('access_token', result.access_token);
            if (result.refresh_token) {
              localStorage.setItem('refresh-token', result.refresh_token);
            }
          }
          this.toasts.push({ id: ++this.toastId, message: 'Login successful!', color: 'success' });
          this.router.navigate(['/admin/cv']);
        }
      });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
