// Removed accidental top-level getProgressBarColor function
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast-component',
  imports: [NgClass],
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
  getProgressBarColor() {
    if (this.color === 'success') return '#28a745';
    if (this.color === 'error') return '#dc3545';
    if (this.color === 'warning') return '#ffc107';
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

  progress = 100;
  private timer: any;
  private duration = 2500;

  ngOnInit() {
    this.progress = 100;
    let step = 100 / (this.duration / 50);
    this.timer = setInterval(() => {
      this.progress -= step;
      if (this.progress <= 0) {
        this.progress = 0;
        clearInterval(this.timer);
      }
    }, 50);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
