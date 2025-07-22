
import { Component, Renderer2, Inject } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DOCUMENT, CommonModule } from '@angular/common';

@Component({
  selector: 'app-dark-and-lght-mode-button-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark-and-lght-mode-button-component.html',
  styleUrls: ['./dark-and-lght-mode-button-component.css'],
  animations: [
    trigger('floatIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(60px) scale(0.7)' }),
        animate('700ms cubic-bezier(.4,0,.2,1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        )
      ])
    ]),
    trigger('clickAnim', [
      state('default', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.88)' })),
      transition('default => clicked', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ]),
      transition('clicked => default', [
        animate('180ms cubic-bezier(.4,0,.2,1)')
      ])
    ])
  ]
})
export class DarkAndLghtModeButtonComponent {

  isDarkMode = false;
  clickState: 'default' | 'clicked' = 'default';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleDarkMode() {
    this.clickState = 'clicked';
    setTimeout(() => {
      this.clickState = 'default';
    }, 180);
    this.isDarkMode = !this.isDarkMode;
    document.body.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light'); 
  }
}
