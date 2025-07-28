import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCardComponent } from '../../components/step-card-component/step-card.component';
import { FormPersonalInfoComponent } from '../form-personal-info-component/form-personal-info.component';
import { FormEducationComponent } from '../form-education-component/form-education.component';
import { FormExperienceComponent } from '../form-experience-component/form-experience.component';
import { FormContactComponent } from '../form-contact-component/form-contact.component';
import { FormCertificationComponent } from '../form-certification-component/form-certification.component';

import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';

@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [
    CommonModule,
    StepCardComponent,
    FormPersonalInfoComponent,
    FormEducationComponent,
    FormExperienceComponent,
    FormContactComponent,
    FormCertificationComponent
  ],
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.css'],
  animations: [
    trigger('modalAnim', [
      state('enter', style({ opacity: 1, transform: 'scale(1)' })),
      state('leave', style({ opacity: 0, transform: 'scale(0.95)' })),
      transition('enter => leave', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)')
      ]),
      transition('void => enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms cubic-bezier(0.4,0,0.2,1)')
      ])
    ]),
    trigger('sidebarAnim', [
      state('enter', style({ opacity: 1, transform: 'translateX(0)' })),
      state('leave', style({ opacity: 0, transform: 'translateX(-40px)' })),
      transition('enter => leave', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)')
      ]),
      transition('void => enter', [
        style({ opacity: 0, transform: 'translateX(-40px)' }),
        animate('200ms cubic-bezier(0.4,0,0.2,1)')
      ])
    ]),
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MultiStepFormComponent implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  modalState: 'enter' | 'leave' = 'enter';

  onClose() {
    this.modalState = 'leave';
    setTimeout(() => {
      this.close.emit();
      this.closed.emit();
    }, 200); // Match animation duration
  }


  @Input() fiche: any;

  personalInfo: any = {
    name: '',
    profil: '',
    adresse: '',
    birthdate: ''
  };

  educationData: any = {
    etablissement: '',
    filiere: '',
    pays: '',
    debut: '',
    fin: '',
    actuel: false
  };

  experienceData: string[] = [];

  contactData: any = {
    email: '',
    phone: '',
    pays: '',
    ville: ''
  };

  certificationData: {
    diplome: string;
    organisation: string;
    date: string;
    description: string;
  }[] = [];

  steps = [
    { label: 'Information Personnelle', icon: '👤' },
    { label: 'Etude', icon: '🎓' },
    { label: 'Experience', icon: '💼' },
    { label: 'Coordonnées', icon: '📇' },
    { label: 'Award/Certification', icon: '🏅' }
  ];

  selectedStepIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fiche'] && this.fiche) {
      console.log("📥 Fiche IA reçue :", this.fiche);

      // Information personnelle
      this.personalInfo = {
        name: this.fiche.name?.split(' ')[0] || '',
        profil: this.fiche.profil || '',
        adresse: this.fiche.address || '',
        birthdate: this.fiche.birthdate || ''
      };

      // Études
      try {
        const educationArray = JSON.parse(this.fiche.education || '[]');
        const findLine = (label: string) =>
          educationArray.find((e: string) => e.toLowerCase().includes(label)) || '';

        this.educationData = {
          etablissement: educationArray[0] || '',
          filiere: educationArray[1] || '',
          pays: findLine('pays')?.split(':')[1]?.trim() || '',
          debut: findLine('début')?.split(':')[1]?.trim() || '',
          fin: findLine('fin')?.split(':')[1]?.trim() || '',
          actuel: !findLine('fin')
        };
      } catch (e) {
        console.error('❌ Erreur parsing education :', e);
      }

      // Expérience
      try {
        this.experienceData = JSON.parse(this.fiche.experience || '[]');
      } catch (e) {
        console.warn('❌ Erreur parsing experience :', e);
        this.experienceData = [];
      }

      // Coordonnées
      this.contactData = {
        email: this.fiche.email || '',
        phone: this.fiche.phone || '',
        pays: this.detectPays(this.fiche.address),
        ville: this.detectVille(this.fiche.address)
      };

      // Certifications
      try {
        const raw = JSON.parse(this.fiche.certifications || '[]');
        this.certificationData = this.parseCertifications(raw);
        console.log("✅ Données certification formatées :", this.certificationData);
      } catch (e) {
        console.warn("❌ Erreur parsing certifications", e);
        this.certificationData = [];
      }
    }
  }

  selectStep(index: number) {
    this.selectedStepIndex = index;
  }

  detectPays(address: string): string {
    if (!address) return '';
    if (address.toLowerCase().includes('maroc')) return 'Maroc';
    if (address.toLowerCase().includes('france')) return 'France';
    return '';
  }

  detectVille(address: string): string {
    const villesConnues = ['Rabat', 'Casablanca', 'Paris', 'Marrakech', 'Tanger'];
    const match = villesConnues.find(v =>
      address?.toLowerCase().includes(v.toLowerCase())
    );
    return match || '';
  }

  parseCertifications(certifStrings: string[]): any[] {
    return certifStrings.map(str => {
      const get = (label: string) => {
        const match = str.match(new RegExp(`${label}\\s*:?\\s*([^|\\n]+)`, 'i'));
        return match ? match[1].trim() : '';
      };

      return {
        diplome: get('Nom'),
        organisation: get('Institution'),
        date: get('Date'),
        description: get('Description') || str
      };
    });
  }
}
