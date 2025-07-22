import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('clickAnim', [
      state('default', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.93)' })),
      transition('default <=> clicked', animate('120ms cubic-bezier(.4,0,.2,1)')),
    ]),
  ],
})
export class LoginComponent {
  @Output() username: string = '';
  @Output() password: string = '';
  @Input() error: string | null = null;
  @Input() loading = false;

  constructor(private router: Router) {}

login() {
    this.router.navigate(['/admin/cv']);
  }
}
