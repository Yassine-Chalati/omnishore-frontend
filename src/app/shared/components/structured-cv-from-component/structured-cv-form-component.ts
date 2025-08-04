import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ToastComponent } from '../../../core/components/toast-component/toast-component';
import { MultiStepFormComponent } from '../multi-step-form-component/multi-step-form.component';

@Component({
  selector: 'app-structured-cv-form-component',
  templateUrl: './structured-cv-form-component.html',
  styleUrl: './structured-cv-form-component.css',
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
  imports: [MultiStepFormComponent, NgIf]
})
export class StructuredCvFormComponent {
  showModal = true;
  @Output() closed = new EventEmitter<void>();
  modalState: 'enter' | 'leave' = 'enter';

  @Input() cvStructured?: import('../../../core/models/cv-structured.model').CvStructured;

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    console.log('Escape key pressed in structured CV form, closing modal...');
    this.closeModal();
  }

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
