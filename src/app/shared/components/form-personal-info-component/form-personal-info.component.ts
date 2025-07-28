import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-personal-info',
  templateUrl: './form-personal-info.component.html',
  styleUrls: ['./form-personal-info.component.css'],
  standalone: true
})
export class FormPersonalInfoComponent {
  @Input() data: any;  // contient name, profil, adresse, birthdate
}
