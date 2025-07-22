import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-button-component.html',
  styleUrls: ['./primary-button-component.css']
})
export class PrimaryButtonComponent {
    @Input() label: string = 'Bouton';
    @Input() width: string = 'auto';
    @Input() height: string = '40px';
    @Input() fontSize: string = '14px';
    @Input() padding: string = '8px 20px';
    @Input() icon: string = 'bi bi-file-earmark-person'; // Default icon class
}
