import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ToastComponent } from '../../../../../../../core/components/toast-component/toast-component';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { CvTableComponent } from '../../components/cv-table-component/cv-table-component';
import { UploadFilesComponent } from '../../../../../../../shared/components/upload-files-component/upload-files-component';
import { PrimaryButtonComponent } from '../../../../../../../shared/components/primary-button-component/primary-button-component';
import { StructuredCvFormComponent } from '../../../../../../../shared/components/structured-cv-from-component/structured-cv-form-component';
import { CvFile } from '../../../../../../../core/models/cv-file.model';
import { CvService } from '../../../../../../../core/services/cv-service';
import { FilePopUpComponent } from "../../../../../../../shared/components/file-pop-up-component/file-pop-up-component";
import { LoaderComponent } from '../../../../../../../shared/components/loader-component/loader-component';
import jsPDF from 'jspdf';
import { CvStructured } from '../../../../../../../core/models/cv-structured.model';

@Component({
  selector: 'app-main-container',
  imports: [PrimaryButtonComponent, CvTableComponent, UploadFilesComponent, ToastComponent, NgIf, NgFor, StructuredCvFormComponent, FilePopUpComponent, LoaderComponent],
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

  cvStructured?: CvStructured;

  onNoFilesReady() {
    this.showToast('warning', 'Aucun fichier prêt à être envoyé.');
  }

  toasts: Array<{ id: number; color: string; message: string }> = [];
  toastIdCounter = 0;

  onUploadCancelled() {
    this.showToast('warning', 'Téléchargement annulé.');
  }
  @ViewChild('uploadFilesComp') uploadFilesComponent!: UploadFilesComponent;
  showUploadModal = false;
  showStructuredCvFormModal = false;
  showFilePopUpModal = false;
  filePopUpUrl: string | null = null;
  filePopUpType: string = '';
  filePopUpName: string = '';
  filePopUpBytes: Uint8Array | ArrayBuffer | null = null;

  cvList: CvFile[] = [];
  totalPages = 1;
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  loading = false;



  constructor(private cvService: CvService) {}

  ngOnInit() {
    this.fetchCvFiles();
  }

  fetchCvFiles(page: number = 0) {
    this.loading = true;
    this.cvService.getCvFiles(page, this.pageSize, 'addedDate,desc').subscribe({
      next: (res) => {
        this.cvList = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.pageSize = res.size;
        this.showToast('success', 'CVs chargés avec succès!');
      },
      error: () => {
        this.showToast('red', 'Erreur lors du chargement des CVs.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openUploadModal() {
    this.showUploadModal = true;
    setTimeout(() => {
      if (this.uploadFilesComponent && this.uploadFilesComponent.resetFiles) {
        this.uploadFilesComponent.resetFiles();
      }
    });
  }

  closeUploadModal() {
    this.showUploadModal = false;
    // Refresh the page automatically when the upload modal is closed
    location.reload();
  }

  openStructuredCvFormModal(cvFileId: number) {
    this.cvService.getStructuredCv(cvFileId).subscribe({
      next: (data) => {
        this.cvStructured = data;
        console.log('Structured CV:', this.cvStructured);
        this.showStructuredCvFormModal = true;
        this.showToast('success', `CV structuré du candidat #${cvFileId} chargé avec succès!`);
      },
      error: () => {
        this.showToast('red', `Erreur lors du chargement du CV structuré du candidat #${cvFileId}.`);
      }
    });
  }

  closeStructuredCvFormModal() {
    this.showStructuredCvFormModal = false;
    setTimeout(() => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        document.body.classList.remove('modal-open');
    }, 200); // Match leave animation duration
  }


  openFilePopUpModal(cvFile?: CvFile) {
    if (!cvFile) return;
    this.showFilePopUpModal = true; // Show modal immediately
    this.filePopUpUrl = null; // Reset URL to trigger loader
    this.cvService.downloadFileAsBlob(cvFile.imageUrl).subscribe({
      next: (blob) => {
        if (this.filePopUpUrl) {
          URL.revokeObjectURL(this.filePopUpUrl);
        }
        if (cvFile.fileType.toLowerCase() === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = () => {
            this.filePopUpUrl = reader.result as string;
            this.filePopUpUrl = this.filePopUpUrl.replace('data:application/octet-stream', 'data:application/pdf');
            this.showFilePopUpModal = true;
          };
          reader.readAsDataURL(blob);
        } else if (cvFile.fileType.toLowerCase().startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const pdf = new jsPDF({ unit: 'px', format: [img.width, img.height] });

              // Embed the image without compression
              pdf.addImage(reader.result as string, 'JPEG', 0, 0, img.width, img.height);

              const pdfBlob = pdf.output('blob');
              this.filePopUpUrl = URL.createObjectURL(pdfBlob);
              this.filePopUpType = 'application/pdf';
              this.showFilePopUpModal = true;
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(blob);
        } else {
          this.filePopUpUrl = URL.createObjectURL(blob);
          this.showFilePopUpModal = true;
        }

        // Convert Blob to ArrayBuffer
        const reader = new FileReader();
        reader.onload = () => {
          this.filePopUpBytes = reader.result as ArrayBuffer; // Pass the original file byte stream to the FilePopUpComponent
        };
        reader.readAsArrayBuffer(blob);

        this.filePopUpType = cvFile.fileType.toLowerCase();
        this.filePopUpName = cvFile.fileName;
      },
      error: (err) => {
        console.error('Error loading file:', err);
        this.showToast('red', 'Erreur lors du chargement du fichier.');
      }
    });
  }

  closeFilePopUpModal() {
    this.showFilePopUpModal = false;
    if (this.filePopUpUrl) {
      URL.revokeObjectURL(this.filePopUpUrl);
      this.filePopUpUrl = null;
    }
    this.filePopUpType = '';
    this.filePopUpName = '';
  }

  onFileUpload(event: { file: File; index: number }) {
    const { file, index } = event;
    this.cvService.uploadCvFile(file).subscribe({
      next: (res) => {
        if (res.type === 4) {
          this.uploadFilesComponent.updateFileUploadState(index, 'success');
          this.showToast('success', 'Fichier téléchargé et vérifié !');
        }
      },
      error: () => {
        this.uploadFilesComponent.updateFileUploadState(index, 'error');
        this.showToast('red', 'Erreur lors du téléchargement du fichier.');
      },
      complete: () => {
        // No need for setTimeout here
      }
    });
  }

  private showToast(color: string, message: string) {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, color, message });
  }

  onToastDone(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }


}
