import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';


@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
    trigger('clickAnim', [
      state('default', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.93)' })),
      transition('default <=> clicked', animate('120ms cubic-bezier(.4,0,.2,1)')),
    ]),
    trigger('loadingAnim', [
      state('idle', style({ opacity: 1 })),
      state('loading', style({ opacity: 0.7, filter: 'blur(1px)' })),
      transition('idle <=> loading', animate('300ms cubic-bezier(.4,0,.2,1)')),
    ]),
    trigger('spinnerFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.7)' }),
        animate('200ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'scale(0.7)' })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  @Input() error: string | null = null;
  @Input() loading = false;
  @Output() login = new EventEmitter<{ username: string; password: string }>();

  buttonState: 'default' | 'clicked' = 'default';

  constructor(private router: Router) {}

  onSubmit(event?: Event) {
    if (event) event.preventDefault();
    this.buttonState = 'clicked';
    setTimeout(() => {
      this.buttonState = 'default';
    }, 150);
    this.login.emit({ username: this.username, password: this.password });
  }
}
