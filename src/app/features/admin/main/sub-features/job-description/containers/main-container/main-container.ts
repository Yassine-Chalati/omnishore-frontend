import { Component, OnInit } from '@angular/core';
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
  showUploadModal = false;
  showPromptModal = false;
  showShowPromptModal = false; // Added flag for ShowPromptComponent
  showFilePopUpModal = false;

  jobDescriptionsFileList: JobDescriptionFile[] = [];
  totalPages = 1;
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  loading = false;

  toasts: Array<{ id: number; color: string; message: string }> = [];
  toastIdCounter = 0;

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

  private showToast(color: string, message: string) {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, color, message });
  }

  onToastDone(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  openPromptModal() {
    this.showPromptModal = true;
  }

  openShowPromptModal() {
    this.showShowPromptModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  closePromptModal() {
    this.showPromptModal = false;
  }

  closeShowPromptModal() {
    this.showShowPromptModal = false;
  }

  openFilePopUpModal(jobFile: JobDescriptionFile) {
    if (jobFile.type === 'PDF') {
      this.showFilePopUpModal = true;
    } else {
      this.openShowPromptModal();
    }
  }
  
  closeFilePopUpModal() {
    this.showFilePopUpModal = false;
  }
}
