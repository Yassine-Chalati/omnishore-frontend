import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepCardComponent } from '../../components/step-card-component/step-card.component';
import { FormPersonalInfoComponent } from '../form-personal-info-component/form-personal-info.component';
import { FormEducationComponent } from '../form-education-component/form-education.component';
import { FormExperienceComponent } from '../form-experience-component/form-experience.component';
import { FormContactComponent } from '../form-contact-component/form-contact.component';
import { FormCertificationComponent } from '../form-certification-component/form-certification.component';

// Import proper models
import { CvStructured } from '../../../core/models/cv-structured.model';
import { BaseEntity } from '../../../core/models/base-entity.model';
import { Contact } from '../../../core/models/contact.model';

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
  @Input() fiche: CvStructured | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  modalState: 'enter' | 'leave' = 'enter';
  
  staticEducations: BaseEntity[] = [];
  educationData: BaseEntity[] = [];
  experienceData: string[] = [];
  certificationData: any[] = [];
  contactData: any = {};
  personalInfo: any = {};

  onClose() {
    this.modalState = 'leave';
    setTimeout(() => {
      this.close.emit();
      this.closed.emit();
    }, 200); // Match animation duration
  }

  steps = [
    { label: 'Information Personnelle', icon: '👤' },
    { label: 'Etude', icon: '🎓' },
    { label: 'Experience', icon: '💼' },
    { label: 'Coordonnées', icon: '📇' },
    { label: 'Award/Certification', icon: '🏅' }
  ];

  selectedStepIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Multi-step form ngOnChanges triggered with:', changes);
    
    if (changes['fiche']) {
      const ficheData = this.fiche;
      console.log('Multi-step form received fiche data:', ficheData);
      
      if (ficheData) {
        // Information personnelle
        this.personalInfo = {
          name: ficheData.name || '',
          profil: ficheData.profil || '',
          adresse: ficheData.contact?.address || '',
          birthdate: '' // This field doesn't exist in CvStructured model
        };

        // Études - using BaseEntity[] directly
        this.staticEducations = ficheData.educations || [];
        this.educationData = [...this.staticEducations];

        // Expérience - map BaseEntity[] to string array
        this.experienceData = ficheData.experiences?.map((exp: BaseEntity) => 
          exp.value || ''
        ) || [];

        // Coordonnées
        this.contactData = {
          email: ficheData.contact?.email || '',
          phone: ficheData.contact?.phone || '',
          pays: this.detectPays(ficheData.contact?.address || ''),
          ville: this.detectVille(ficheData.contact?.address || '')
        };

        // Certifications - map BaseEntity[] to expected format
        this.certificationData = ficheData.certifications?.map((cert: BaseEntity) => ({
          diplome: cert.value || '',
          organisation: '',
          date: '',
          description: cert.value || ''
        })) || [];

        console.log('Successfully mapped data:', {
          personalInfo: this.personalInfo,
          educationData: this.educationData,
          experienceData: this.experienceData,
          contactData: this.contactData,
          certificationData: this.certificationData
        });
      } else {
        // Initialize with empty data if no fiche provided
        console.log('No fiche data provided, initializing with empty values');
        this.initializeEmptyData();
      }
    }
  }

  private initializeEmptyData() {
    this.personalInfo = {
      name: '',
      profil: '',
      adresse: '',
      birthdate: ''
    };
    this.staticEducations = [];
    this.educationData = [];
    this.experienceData = [];
    this.contactData = {
      email: '',
      phone: '',
      pays: '',
      ville: ''
    };
    this.certificationData = [];
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
