import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from "../../../../../../../shared/components/primary-button-component/primary-button-component";

@Component({
  selector: 'app-prompt-component',
  imports: [CommonModule, FormsModule, PrimaryButtonComponent],
  templateUrl: './prompt-component.html',
  styleUrl: './prompt-component.css'
})
export class PromptComponent {
  promptText: string = '';
  sentPrompts: string[] = [];

  sendPrompt() {
    const text = this.promptText?.trim();
    if (text) {
      this.sentPrompts.push(text);
      this.promptText = '';
    }
  }
}
