// Removed accidental top-level getProgressBarColor function
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-toast-component',
  imports: [CommonModule, NgClass],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Output() animationDone = new EventEmitter<void>();
  getProgressBarColor() {
    return '#fff';
  }
  /**
   * Toast color: 'success', 'error', 'warning', or any CSS color string
   */
  @Input() color: 'success' | 'error' | 'warning' | string = 'success';
  /**
   * Toast message
   */
  @Input() message = '';

  /**
   * Toast duration in milliseconds
   */
  @Input() duration: number = 2500;

  progress = 100;
  private timer: any;

  ngOnInit() {
    this.progress = 100;
    let step = 100 / (this.duration / 50);
    this.timer = setInterval(() => {
      this.progress -= step;
      if (this.progress <= 0) {
        this.progress = 0;
        clearInterval(this.timer);
        this.animationDone.emit();
      }
    }, 50);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
