// ...existing code...
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar-component',
  imports: [CommonModule],
  templateUrl: './nav-bar-component.html',
  styleUrl: './nav-bar-component.css',
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('clickAnim', [
      state('default', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.93)' })),
      transition('default => clicked', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ]),
      transition('clicked => default', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ])
    ]),
    trigger('logoCharAnim', [
      state('normal', style({ display: 'inline-block', color: '#fff', transform: 'scale(1)' })),
      state('hover', style({ display: 'inline-block', color: '#e75480' })),
      transition('normal => hover', [
        animate('0.7s cubic-bezier(.4,0,.2,1)', keyframes([
          style({ transform: 'scale(1) rotate(0deg)', offset: 0 }),
          style({ transform: 'scale(1.85) rotate(-10deg)', offset: 0.25 }),
          style({ transform: 'scale(1.7) rotate(10deg)', offset: 0.5 }),
          style({ transform: 'scale(1.85) rotate(-10deg)', offset: 0.75 }),
          style({ transform: 'scale(1) rotate(0deg)', offset: 1 })
        ]))
      ]),
      transition('hover => normal', [
        animate('0.3s cubic-bezier(.4,0,.2,1)', style({ transform: 'scale(1) rotate(0deg)', color: '#fff' }))
      ])
    ])
  ]
})
export class NavBarComponent {
  @Input() logoUrl = '';
  @Input() cvUrl = '/cv';
  @Input() jobDescriptionUrl = '/job-description';
  @Input() logoutUrl = '/login';


  clickStates: { [key: string]: 'default' | 'clicked' } = {
    'cv': 'default',
    'job-description': 'default',
    'logout': 'default'
  };


  logoCharStates: ('normal' | 'hover')[] = Array.from('Omnishore').map(() => 'normal');

  // Detect dark mode by checking if body has the dark-mode class
  get isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  get logoChars() {
    return Array.from('Omnishore');
  }

  setLogoCharState(idx: number, state: 'normal' | 'hover') {
    this.logoCharStates[idx] = state;
  }

  selectedTab: string = 'cv';

 constructor(
    private router: Router,
    private route: ActivatedRoute
    // private keycloakService: KeycloakService 
  ) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const currentUrl = this.router.url;

      if (currentUrl.includes(this.cvUrl)) {
        this.selectedTab = 'cv';
      } else if (currentUrl.includes(this.jobDescriptionUrl)) {
        this.selectedTab = 'job-description';
      } else {
        this.selectedTab = '';
      }
    });
  }

  goTo(path: string) {
    // Determine which tab is being clicked based on input URLs
    let tab = '';
    if (path === this.cvUrl) {
      tab = 'cv';
    } else if (path === this.jobDescriptionUrl) {
      tab = 'job-description';
    }
    if (tab) {
      this.clickStates[tab] = 'clicked';
      setTimeout(() => this.clickStates[tab] = 'default', 150);
      this.selectedTab = tab;
    }
    this.router.navigate([path], { relativeTo: this.route });
  }

  logout() {
    this.clickStates['logout'] = 'clicked';
    setTimeout(() => {
      this.clickStates['logout'] = 'default';
      this.router.navigate([this.logoutUrl]);
    }, 150);
    // this.keycloakService.logout({
    //   redirectUri: window.location.origin + '/login'
    // });
  }
}
