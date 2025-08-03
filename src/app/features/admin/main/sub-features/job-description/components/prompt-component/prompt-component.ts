import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from "../../../../../../../shared/components/primary-button-component/primary-button-component";

@Component({
  selector: 'app-prompt-component',
  imports: [CommonModule, FormsModule, PrimaryButtonComponent],
  templateUrl: './prompt-component.html',
  styleUrl: './prompt-component.css',
  animations: [
    trigger('zoomIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms cubic-bezier(.17,.67,.83,.67)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(.17,.67,.83,.67)', style({ transform: 'scale(0.8)', opacity: 0 }))
      ])
    ])
  ]
})
export class PromptComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() promptSent = new EventEmitter<string>();
  promptText: string = '';
  sentPrompts: string[] = [];
  showModal: boolean = true;

  closeModal() {
    this.showModal = false;
    setTimeout(() => {
      this.closed.emit();
    }, 200); // match leave animation duration
  }

  sendPrompt() {
    const text = this.promptText?.trim();
    if (text) {
      this.sentPrompts.push(text);
      this.promptSent.emit(text);
      this.promptText = '';
    }
  }
}
