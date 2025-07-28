import { Component, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-card',
  standalone: true,
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.css']
})
export class StepCardComponent {
  @Input() label: string = '';
  @Input() icon: string = '';

  private _selected = false;
  @Input() set selected(value: boolean) {
    this._selected = value;
  }
  get selected(): boolean {
    return this._selected;
  }
  @HostBinding('class.selected') get selectedClass() {
    return this._selected;
  }

  @Output() stepClick = new EventEmitter<void>();

  onStepClick() {
    this.stepClick.emit();
  }
}
