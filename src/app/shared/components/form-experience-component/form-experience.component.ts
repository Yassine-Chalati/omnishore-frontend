import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-experience.component.html',
  styleUrls: ['./form-experience.component.css']
})
export class FormExperienceComponent implements OnChanges {
  @Input() data: string[] = [];

  experience = {
    poste: '',
    entreprise: '',
    adresse: '',
    intitulePoste: '',
    debut: '',
    fin: '',
    actuel: false,
    description: ''
  };

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) return;

    const ligne = this.data[0]; // On prend la première ligne extraite par l’IA

    this.experience = {
      poste: this.extractField(ligne, 'poste'),
      entreprise: this.extractField(ligne, 'entreprise'),
      adresse: this.extractField(ligne, 'adresse'),
      intitulePoste: this.extractField(ligne, 'intitulé') || this.extractField(ligne, 'titre'),
      debut: this.extractField(ligne, 'début'),
      fin: this.extractField(ligne, 'fin'),
      actuel: !ligne.toLowerCase().includes('fin'), // pas de date de fin = poste actuel
      description: ligne
    };
  }

  extractField(text: string, keyword: string): string {
    const regex = new RegExp(`${keyword}\\s*:?\\s*(.+?)($|\\||,|\\n)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }
}
