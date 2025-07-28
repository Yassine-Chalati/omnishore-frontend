import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-certification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-certification.component.html',
  styleUrls: ['./form-certification.component.css']
})
export class FormCertificationComponent {
  @Input() data: {
    organisation: string;
    diplome: string;
    date: string;
    description: string;
  }[] = [];

  ngOnInit() {
  console.log("📘 Certifications reçues :", this.data);
}

}
