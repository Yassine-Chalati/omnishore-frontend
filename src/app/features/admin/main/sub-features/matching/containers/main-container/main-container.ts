import { Component, OnInit, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ToastComponent } from '../../../../../../../core/components/toast-component/toast-component';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { MatchingTableComponent } from '../../components/matching-table-component/matching-table-component';
import { PrimaryButtonComponent } from '../../../../../../../shared/components/primary-button-component/primary-button-component';
import { Matching } from '../../../../../../../core/models/matching.model';
import { CvStructured } from '../../../../../../../core/models/cv-structured.model';
import { StructuredCvFormComponent } from "../../../../../../../shared/components/structured-cv-from-component/structured-cv-form-component";
import { FilePopUpComponent } from "../../../../../../../shared/components/file-pop-up-component/file-pop-up-component";
import { ActivatedRoute, Router } from '@angular/router';
import { JobDescriptionService } from '../../../../../../../core/services/job-description-service';
import { CvService } from '../../../../../../../core/services/cv-service';
import { LoaderComponent } from '../../../../../../../shared/components/loader-component/loader-component';
import jsPDF from 'jspdf';
import { ShowPromptComponent } from '../../../job-description/components/show-prompt-component/show-prompt-component';


@Component({
  selector: 'app-main-container',
  imports: [PrimaryButtonComponent, MatchingTableComponent, ToastComponent, NgIf, NgFor, StructuredCvFormComponent, FilePopUpComponent, LoaderComponent, ShowPromptComponent],
  templateUrl: './main-container.html',
  styleUrl: './main-container.css',
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('clickAnim', [
      state('default', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.93)' })),
      transition('default => clicked', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ]),
      transition('clicked => default', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ])
    ]),
    trigger('logoCharAnim', [
      state('normal', style({ display: 'inline-block', color: '#fff', transform: 'scale(1)' })),
      state('hover', style({ display: 'inline-block', color: '#e75480' })),
      transition('normal => hover', [
        animate('0.7s cubic-bezier(.4,0,.2,1)', keyframes([
          style({ transform: 'scale(1) rotate(0deg)', offset: 0 }),
          style({ transform: 'scale(1.85) rotate(-10deg)', offset: 0.25 }),
          style({ transform: 'scale(1.7) rotate(10deg)', offset: 0.5 }),
          style({ transform: 'scale(1.85) rotate(-10deg)', offset: 0.75 }),
          style({ transform: 'scale(1) rotate(0deg)', offset: 1 })
        ]))
      ]),
      transition('hover => normal', [
        animate('0.3s cubic-bezier(.4,0,.2,1)', style({ transform: 'scale(1) rotate(0deg)', color: '#fff' }))
      ])
    ])
  ]
})
export class MainContainer implements OnInit {
  @Input() jobDescriptionData: any;

  showUploadModal = false;
  showStructuredCvFormModal = false;
  showFilePopUpModal = false;

  matchingList: Matching[] = [];
  cvStructured: CvStructured | null = null;
  loading = false;
  jobDescriptionId: number | null = null;
  
  toasts: Array<{ id: number; color: string; message: string; duration?: number }> = [];
  toastIdCounter = 0;

  filePopUpUrl: string | null = null;
  filePopUpType: string = '';
  filePopUpName: string = '';
  filePopUpBytes: ArrayBuffer | null = null;
  filePopUpLoading: boolean = false;
  
  showShowPromptModal = false;
  showPromptContent: string = '';

  constructor(
    private jobDescriptionService: JobDescriptionService,
    private cvService: CvService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    console.log('MainContainer ngOnInit - jobDescriptionData from @Input:', this.jobDescriptionData);
    
    // If no data passed from parent, try localStorage (refresh scenario)
    if (!this.jobDescriptionData) {
      console.log('jobDescriptionData is null, trying localStorage...');
      const cached = localStorage.getItem('currentJobDescriptionData');
      if (cached) {
        try {
          const parsedData = JSON.parse(cached);
          
          // Check if the stored data has the new structure
          if (parsedData.jobDescriptionData && parsedData.jobDescriptionId) {
            this.jobDescriptionData = parsedData.jobDescriptionData;
            console.log('Job description data recovered from localStorage (new format):', this.jobDescriptionData);
          } else {
            // Handle old format (backward compatibility)
            this.jobDescriptionData = parsedData;
            console.log('Job description data recovered from localStorage (old format):', this.jobDescriptionData);
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          this.showToast('red', 'Erreur lors de la récupération des données');
          this.loading = false;
          return;
        }
      } else {
        console.log('No data found in localStorage either');
        this.showToast('red', 'Données de la fiche de poste non disponibles');
        this.loading = false;
        return;
      }
    }
    
    if (this.jobDescriptionData) {
      console.log('JobDescriptionData is available:', this.jobDescriptionData);
      this.loadMatchingData();
    } else {
      this.showToast('red', 'Données de la fiche de poste non disponibles');
      this.loading = false;
    }
  }

  private loadMatchingData() {

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.jobDescriptionId = id;
      if (id) {
        this.jobDescriptionService.getJobDescriptionMatches(id).subscribe({
          next: (data) => {
            this.matchingList = data.sort((a, b) => b.score - a.score);
            this.showToast('success', 'Données de matching chargées avec succès!');
          },
          error: (err) => {
            this.showToast('error', 'Erreur lors du chargement des données.');
            this.matchingList = [];
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    });
  }

  private showToast(color: string, message: string, timeout: number = 2500) {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, color, message, duration: timeout });
    setTimeout(() => {
      this.onToastDone(id);
    }, timeout);
  }

  onToastDone(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  openFilePopUpModal(cvFile?: any) {
    if (!cvFile) return;
    
    this.filePopUpLoading = true;
    this.filePopUpUrl = null;
    this.filePopUpType = '';
    this.filePopUpName = '';
    this.filePopUpBytes = null;
    this.showFilePopUpModal = true;
    
    this.cvService.downloadFileAsBlob(cvFile.imageUrl).subscribe({
      next: (blob) => {
        this.showToast('success', 'Fichier CV chargé avec succès.');
        if (this.filePopUpUrl) {
          URL.revokeObjectURL(this.filePopUpUrl);
        }

        // Check if it's an image file
        const isImage = cvFile.fileType && cvFile.fileType.startsWith('image/');
        
        if (isImage) {
          // Convert image to PDF
          this.convertImageToPdf(blob, cvFile.fileName);
        } else {
          // Handle as PDF directly
          const reader = new FileReader();
          reader.onload = () => {
            this.filePopUpUrl = reader.result as string;
            this.filePopUpUrl = this.filePopUpUrl.replace('data:application/octet-stream', 'data:application/pdf');
            this.filePopUpLoading = false;
          };
          reader.readAsDataURL(blob);

          // Convert Blob to ArrayBuffer
          const arrayBufferReader = new FileReader();
          arrayBufferReader.onload = () => {
            this.filePopUpBytes = arrayBufferReader.result as ArrayBuffer;
          };
          arrayBufferReader.readAsArrayBuffer(blob);

          this.filePopUpType = 'application/pdf';
          this.filePopUpName = cvFile.fileName.endsWith('.pdf') ? cvFile.fileName : `${cvFile.fileName}.pdf`;
        }
      },
      error: (err) => {
        console.error('Error loading CV file:', err);
        this.showToast('error', 'Erreur lors du chargement du fichier CV.');
        this.filePopUpLoading = false;
        this.showFilePopUpModal = false;
      }
    });
  }

  openJobDescriptionPopUpModal() {
    if (!this.jobDescriptionData) {
      this.showToast('error', 'Données de la fiche de poste non disponibles. Veuillez naviguer depuis la page des fiches de poste.');
      return;
    }
    console.log('Opening job description pop-up modal with data:', this.jobDescriptionData);
    this.handleJobDescriptionDisplay(this.jobDescriptionData);
  }

  private handleJobDescriptionDisplay(jobFile: any) {
    
    if (jobFile.type === 'PROMPT') {
      if (jobFile.content && jobFile.content.trim() !== '') {
        this.openShowPromptModal(jobFile.content);
        this.showToast('success', 'Prompt chargé avec succès.');
      } else {
        this.showToast('error', "Le contenu du prompt n'est pas disponible.");
      }
      return;
    }
    
    this.filePopUpLoading = true;
    this.filePopUpUrl = null;
    this.filePopUpType = '';
    this.filePopUpName = '';
    this.filePopUpBytes = null;
    this.showFilePopUpModal = true;
    
    this.jobDescriptionService.downloadFileAsBlob(jobFile.fileName).subscribe({
      next: (blob) => {
        this.showToast('success', 'Fichier chargé avec succès.');
        if (this.filePopUpUrl) {
          URL.revokeObjectURL(this.filePopUpUrl);
        }
        const reader = new FileReader();
        reader.onload = () => {
          this.filePopUpUrl = reader.result as string;
          this.filePopUpUrl = this.filePopUpUrl.replace('data:application/octet-stream', 'data:application/pdf');
          this.filePopUpLoading = false;
        };
        reader.readAsDataURL(blob);

        // Convert Blob to ArrayBuffer
        const arrayBufferReader = new FileReader();
        arrayBufferReader.onload = () => {
          this.filePopUpBytes = arrayBufferReader.result as ArrayBuffer;
        };
        arrayBufferReader.readAsArrayBuffer(blob);

        this.filePopUpType = 'application/pdf';
        this.filePopUpName = jobFile.fileName.endsWith('.pdf') ? jobFile.fileName : `${jobFile.fileName}.pdf`;
      },
      error: (err) => {
        console.error('Error loading file:', err);
        this.showToast('error', 'Erreur lors du chargement du fichier.');
        this.filePopUpLoading = false;
        this.showFilePopUpModal = false;
      }
    });
  }

  openShowPromptModal(content?: string) {
    if (content) {
      this.showPromptContent = content;
    }
    this.showShowPromptModal = true;
  }

  closeShowPromptModal() {
    this.showShowPromptModal = false;
    this.showPromptContent = '';
  }

  private convertImageToPdf(imageBlob: Blob, fileName: string) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({ unit: 'px', format: [img.width, img.height] });

        // Embed the image without compression
        pdf.addImage(reader.result as string, 'JPEG', 0, 0, img.width, img.height);
        
        // Convert PDF to blob and create URL
        const pdfBlob = pdf.output('blob');
        this.filePopUpUrl = URL.createObjectURL(pdfBlob);
        
        // Convert PDF blob to ArrayBuffer
        const arrayBufferReader = new FileReader();
        arrayBufferReader.onload = () => {
          this.filePopUpBytes = arrayBufferReader.result as ArrayBuffer;
        };
        arrayBufferReader.readAsArrayBuffer(pdfBlob);
        
        this.filePopUpType = 'application/pdf';
        this.filePopUpName = fileName.replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.pdf');
        this.filePopUpLoading = false;
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageBlob);
  }

  closeFilePopUpModal() {
    this.showFilePopUpModal = false;
    this.filePopUpLoading = false;
    if (this.filePopUpUrl) {
      URL.revokeObjectURL(this.filePopUpUrl);
      this.filePopUpUrl = null;
    }
    this.filePopUpType = '';
    this.filePopUpName = '';
    this.filePopUpBytes = null;
  }

  openStructuredCvFormModal(cvFileId: number) {
    console.log('Opening structured CV modal for CV ID:', cvFileId);
    
    this.cvService.getStructuredCv(cvFileId).subscribe({
      next: (data) => {
        this.cvStructured = data;
        console.log('Structured CV loaded:', this.cvStructured);
        this.showStructuredCvFormModal = true;
        this.showToast('success', `CV structuré du candidat #${cvFileId} chargé avec succès!`);
      },
      error: (err) => {
        console.error('Error loading structured CV:', err);
        this.showToast('error', `Erreur lors du chargement du CV structuré du candidat #${cvFileId}.`);
      }
    });
  }

  closeStructuredCvFormModal() {
    this.showStructuredCvFormModal = false;
    this.cvStructured = null; // Clear the data when closing
    setTimeout(() => {
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }, 100);
  }


}
