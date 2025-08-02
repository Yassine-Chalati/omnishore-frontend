import { Component, Input, OnChanges, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-form-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-experience.component.html',
  styleUrls: ['./form-experience.component.css'],
  animations: [
    trigger('pageChangeAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class FormExperienceComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() data: any[] = [];
  @Input() experiences: any[] = []; // Declare the experiences property
  @ViewChildren('textarea') textareas!: QueryList<ElementRef>;

  currentPage: number = 0; // Current page for pagination

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
    const first = this.data[0];
    const ligne = typeof first === 'string' ? first : first.value;
    this.experience = {
      poste: this.extractField(ligne, 'poste'),
      entreprise: this.extractField(ligne, 'entreprise'),
      adresse: this.extractField(ligne, 'adresse'),
      intitulePoste: this.extractField(ligne, 'intitulé') || this.extractField(ligne, 'titre'),
      debut: this.extractField(ligne, 'début'),
      fin: this.extractField(ligne, 'fin'),
      actuel: !ligne.toLowerCase().includes('fin'),
      description: ligne
    };
    this.experiences = this.data.map(item => typeof item === 'string' ? { value: item } : item);
  }

  ngOnInit(): void {
    this.experiences = [
      { id: 1, value: "EXPERIENCE PROFESSIONNELLES" },
      { id: 2, value: "Stagiaire informatique Menara Prefa - Marrakech Analyse des besoins clients." },
      { id: 3, value: "Analyse de l'existence Conception et programmation d'applications et de solutions logicielles dans le respect du cahier des charges." },
      { id: 4, value: "Réalisation d'applications web." },
      { id: 5, value: "Participation aux réunions d'équipe pour discuter des progrès, des défis et des opportunités liées au développement logiciel." },
      { id: 6, value: "Technologies: Spring Boot." },
      { id: 7, value: "Angular (TypeScript, HTML et CSS)." },
      { id: 8, value: "Architecture Monolithique." }
    ];
  }

  extractField(text: string, keyword: string): string {
    const regex = new RegExp(`${keyword}\\s*:?\\s*(.+?)($|\\||,|\\n)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  get totalPages(): number {
    return Math.ceil(this.experiences.length / 3);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      // Adjust heights after page change
      setTimeout(() => this.adjustAllTextareaHeights(), 0);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];

    if (this.totalPages <= 7) {
      for (let i = 0; i < this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let start: number;
      let end: number;

      if (this.currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (this.currentPage >= this.totalPages - 4) {
        start = this.totalPages - 5;
        end = this.totalPages - 1;
      } else {
        start = this.currentPage - 2;
        end = this.currentPage + 2;
      }

      for (let i = start; i <= end && i < this.totalPages - 1; i++) {
        if (i > 0) {
          visiblePages.push(i);
        }
      }
    }

    return visiblePages;
  }

  trackByFn(index: number, page: number): number {
    return page;
  }

  ngAfterViewInit(): void {
    this.adjustAllTextareaHeights();
  }

  adjustAllTextareaHeights(): void {
    setTimeout(() => {
      this.textareas.forEach(textarea => {
        this.adjustTextareaHeight(textarea.nativeElement);
      });
    }, 0);
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  adjustHeight(target: EventTarget | null): void {
    const textarea = target as HTMLTextAreaElement | null;
    if (textarea) {
      this.adjustTextareaHeight(textarea);
    }
  }
}
