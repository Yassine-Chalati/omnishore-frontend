import { Component, Input, } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.css'],
  standalone: true,
    imports: [NgIf]
})
export class FormContactComponent {
  @Input() data: any; // { email, phone, pays, ville }
}
