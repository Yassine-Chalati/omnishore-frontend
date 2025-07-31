import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
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

@Component({
  selector: 'app-main-container',
  imports: [PrimaryButtonComponent, CvTableComponent, UploadFilesComponent, ToastComponent, NgIf, StructuredCvFormComponent, FilePopUpComponent, LoaderComponent],
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
  @ViewChild('uploadFilesComp') uploadFilesComponent!: UploadFilesComponent;
  showUploadModal = false;
  showStructuredCvFormModal = false;
  showFilePopUpModal = false;

  cvList: CvFile[] = [];
  totalPages = 1;
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  loading = false;

  toastMessage: string | null = null;
  toastColor: string = 'info';

  constructor(private cvService: CvService) {}

  ngOnInit() {
    this.fetchCvFiles();
  }

  fetchCvFiles(page: number = 0) {
    this.loading = true;
    this.toastMessage = null;
    this.cvService.getCvFiles(page, this.pageSize, 'addedDate,desc').subscribe({
      next: (res) => {
        this.cvList = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.pageSize = res.size;
        this.toastColor = 'success';
        this.toastMessage = 'CVs chargés avec succès!';
      },
      error: () => {
        this.toastColor = 'red';
        this.toastMessage = 'Erreur lors du chargement des CVs.';
      },
      complete: () => {
        this.loading = false;
        if (this.toastMessage) {
          setTimeout(() => { this.toastMessage = null; }, 3000);
        }
      }
    });
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  openStructuredCvFormModal() {
    this.showStructuredCvFormModal = true;
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

  openFilePopUpModal() {
    this.showFilePopUpModal = true;
  }

  closeFilePopUpModal() {
    this.showFilePopUpModal = false;
  }

  onFileUpload(event: { file: File; index: number }) {
    const { file, index } = event;
    this.cvService.uploadCvFile(file).subscribe({
      next: (res) => {
        if (res.type === 4) {
          this.uploadFilesComponent.updateFileUploadState(index, 'success');
          this.toastColor = 'success';
          this.toastMessage = 'Fichier téléchargé et vérifié !';
        }
      },
      error: () => {
        this.uploadFilesComponent.updateFileUploadState(index, 'error');
        this.toastColor = 'red';
        this.toastMessage = 'Erreur lors du téléchargement du fichier.';
      },
      complete: () => {
        setTimeout(() => { this.toastMessage = null; }, 3000);
      }
    });
  }

}
