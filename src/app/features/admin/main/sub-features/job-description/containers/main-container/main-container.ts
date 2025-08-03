import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from "../../../../../../../core/components/toast-component/toast-component";
import { PrimaryButtonComponent } from "../../../../../../../shared/components/primary-button-component/primary-button-component";
import { UploadFilesComponent } from "../../../../../../../shared/components/upload-files-component/upload-files-component";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgIf, NgFor } from '@angular/common';
import { JobDescriptionTableComponent } from "../../components/job-description-table-component/job-description-table-component";
import { JobDescriptionFile } from '../../../../../../../core/models/job-description-file.model';
import { PromptComponent } from "../../components/prompt-component/prompt-component";
import { FilePopUpComponent } from "../../../../../../../shared/components/file-pop-up-component/file-pop-up-component";
import { JobDescriptionService } from '../../../../../../../core/services/job-description-service';
import { LoaderComponent } from '../../../../../../../shared/components/loader-component/loader-component';
import { ShowPromptComponent } from '../../components/show-prompt-component/show-prompt-component';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-main-container',
  imports: [ToastComponent, PrimaryButtonComponent, UploadFilesComponent, NgIf, NgFor, JobDescriptionTableComponent, PromptComponent, FilePopUpComponent, LoaderComponent, ShowPromptComponent],
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
  showPromptModal = false;
  showShowPromptModal = false;
  showFilePopUpModal = false;
  showPromptContent: string = '';

  jobDescriptionsFileList: JobDescriptionFile[] = [];
  totalPages = 1;
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  loading = false;
  promptLoading = false;

  toasts: Array<{ id: number; color: string; message: string; duration?: number }> = [];
  toastIdCounter = 0;

  filePopUpUrl: string | null = null;
  filePopUpType: string = '';
  filePopUpName: string = '';
  filePopUpBytes: ArrayBuffer | null = null;
  filePopUpLoading: boolean = false;

  constructor(private jobDescriptionService: JobDescriptionService) {}

  ngOnInit() {
    this.fetchJobDescriptionFiles();
  }

  fetchJobDescriptionFiles(page: number = 0) {
    this.loading = true;
    this.jobDescriptionService.getJobDescriptionFiles(page, this.pageSize, 'id,desc').subscribe({
      next: (res) => {
        this.jobDescriptionsFileList = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.pageSize = res.size;
        this.showToast('success', 'Fiches de poste chargées avec succès!');
      },
      error: () => {
        this.showToast('red', 'Erreur lors du chargement des fiches de poste.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onTablePageChange(page: number) {
    this.fetchJobDescriptionFiles(page - 1);
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

  openUploadModal() {
    this.showUploadModal = true;
    setTimeout(() => {
      if (this.uploadFilesComponent && this.uploadFilesComponent.resetFiles) {
        this.uploadFilesComponent.resetFiles();
      }
    });
  }

  openPromptModal() {
    this.showPromptModal = true;
  }

  openShowPromptModal(content?: string) {
    if (content) {
      this.showPromptContent = content;
    }
    this.showShowPromptModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  closePromptModal() {
    this.showPromptModal = false;
  }

  handlePromptSent(promptText: string) {
    this.promptLoading = true;
    this.jobDescriptionService.uploadPrompt(promptText).subscribe({
      next: (res) => {
        this.showToast('success', 'Prompt envoyé avec succès!');
        this.closePromptModal();
        this.fetchJobDescriptionFiles(0);
      },
      error: () => {
        this.showToast('red', 'Erreur lors de l\'envoi du prompt.');
      },
      complete: () => {
        this.promptLoading = false;
      }
    });
  }

  closeShowPromptModal() {
    this.showShowPromptModal = false;
    this.showPromptContent = '';
  }

  openFilePopUpModal(jobFile?: JobDescriptionFile) {
    if (!jobFile) return;
    if (jobFile.type === 'PROMPT') {
      if (jobFile.content && jobFile.content.trim() !== '') {
        this.openShowPromptModal(jobFile.content);
        this.showToast('success', 'Prompt chargé avec succès.');
      } else {
        this.showToast('red', "Le contenu du prompt n'est pas disponible.");
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
        this.showToast('red', 'Erreur lors du chargement du fichier.');
        this.filePopUpLoading = false;
        this.showFilePopUpModal = false;
      }
    });
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

  onFileUpload(event: { file: File; index: number }) {
    const { file, index } = event;
    this.jobDescriptionService.uploadJobDescriptionFile(file).subscribe({
      next: (res) => {
        this.uploadFilesComponent.updateFileUploadState(index, 'success');
        this.showToast('success', 'Fichier téléchargé et vérifié !');
        this.closeUploadModal();
        this.fetchJobDescriptionFiles(0);
      },
      error: () => {
        this.uploadFilesComponent.updateFileUploadState(index, 'error');
        this.showToast('red', 'Erreur lors du téléchargement du fichier.');
      }
    });
  }

  onUploadCancelled() {
    this.showToast('warning', "La procédure de téléchargement est toujours en cours sur le serveur backend et n'est pas annulée, malgré le fait que le processus de téléchargement soit fermé.",  15000);
  } 

  onNoFilesReady() {
    this.showToast('warning', 'Aucun fichier prêt à être envoyé.');
  }
}
