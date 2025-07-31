import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-loader-component',
  templateUrl: './loader-component.html',
  styleUrl: './loader-component.css',
  standalone: true,
  animations: [
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('250ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('fileListAnim', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(60, [animate('300ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' }))])
        ], { optional: true })
      ])
    ])
  ],
  imports: [NgIf]
})
export class LoaderComponent {
  @Input() loaderMessage: string = 'Chargement...';
  @Input() modalState: 'enter' | 'leave' = 'enter';

  showModal = true;
  @Output() closed = new EventEmitter<void>();

  closeModal() {
    this.modalState = 'leave';
  }

  onModalAnimDone(event: any) {
    if (event.toState === 'leave') {
        this.closed.emit();
        this.modalState = 'enter';
    }
  }
}
