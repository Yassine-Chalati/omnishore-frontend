import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
// Remove CvService import
// import { CvService } from '../../../core/services/cv-service';
import { Subscription } from 'rxjs';
import { ToastComponent } from '../../../core/components/toast-component/toast-component';

@Component({
  selector: 'app-upload-files-component',
  templateUrl: './upload-files-component.html',
  styleUrl: './upload-files-component.css',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ToastComponent],
  animations: [
    trigger('modalAnim', [
      transition('void => enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('250ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition('enter => leave', [
        animate('200ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('fileListAnim', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(60, [animate('300ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' }))])
        ], { optional: true })
      ])
    ])
  ]
})
export class UploadFilesComponent {
  /**
   * Tracks the upload state for each file: 'idle' | 'uploading' | 'success' | 'error'
   */
  fileUploadStates: Array<'idle' | 'ready' | 'uploading' | 'success' | 'error'> = [];
  fileLoadProgress: number[] = [];
  /**
   * Toast stack array
   */
  toasts: Array<{ id: number; color: string; message: string }> = [];
  toastIdCounter = 0;
  @Output() closed = new EventEmitter<void>();
  @Output() uploadCancelled = new EventEmitter<void>();
  @Output() fileUpload = new EventEmitter<{ file: File; index: number }>();
  @Output() noFilesReady = new EventEmitter<void>();
  @Input() allowMultiple: boolean = true;
  @Input() maxFileSizeMb: number = 10;
  /**
   * Toast position: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
   */
  @Input() toastPosition: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'bottom-left';
  modalState: 'enter' | 'leave' = 'enter';

  files: File[] = [];
  dragOver = false;
  progress = 0;
  uploading = false;

  /**
   * Track all upload subscriptions so we can cancel them on modal close
   */
  uploadSubscriptions: Subscription[] = [];

  constructor() {}


  hasReadyFiles(): boolean {
    return this.fileUploadStates.some(state => state === 'ready');
  }

  deleteAllFiles() {
    this.files = [];
    this.fileUploadStates = [];
  }

  closeModal() {
    const uploading = this.fileUploadStates.some(state => state === 'uploading');
    if (uploading) {
      this.uploadCancelled.emit();
      this.showToastMsg('warning', 'Téléchargement annulé.');
    }
    this.cancelAllUploads();
    this.resetFiles();
    this.modalState = 'leave';
    setTimeout(() => {
      this.closed.emit();
      this.modalState = 'enter';
    }, 200); // match leave animation duration
  }

  /**
   * Reset all loaded files and their states (memory cleanup)
   */
  resetFiles() {
    this.cancelAllUploads();
    this.files = [];
    this.fileUploadStates = [];
    this.fileLoadProgress = [];
  }

  /**
   * Cancel all ongoing upload subscriptions
   */
  cancelAllUploads() {
    this.uploadSubscriptions.forEach(sub => sub.unsubscribe());
    this.uploadSubscriptions = [];
  }

  // Enable drag-and-drop for the whole page
  @HostListener('window:dragover', ['$event'])
  onWindowDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  @HostListener('window:dragleave', ['$event'])
  onWindowDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  @HostListener('window:drop', ['$event'])
  onWindowDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    // Only handle if modal is open
    const modal = document.querySelector('.modal-content');
    if (!modal) return;
    // Check if drop is outside the modal
    let droppedOutside = true;
    if (event.composedPath) {
      droppedOutside = !event.composedPath().includes(modal);
    } else if (event.target instanceof Node) {
      droppedOutside = !modal.contains(event.target as Node);
    }
    if (droppedOutside && event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(Array.from(event.dataTransfer.files));
      // Debug: log file drop
      console.log('Dropped files outside modal.');
    }
    // If dropped inside modal, do nothing (handled by onDrop)
  }

  onFileSelected(event: any) {
    const selectedFiles = Array.from(event.target.files as FileList);
    if (!this.allowMultiple && selectedFiles.length > 1) {
      this.showToastMsg('warning', 'Vous ne pouvez sélectionner qu\'un seul fichier.');
      // Reset files and replace with the first selected file
      this.files = [];
      this.fileUploadStates = [];
      this.fileLoadProgress = [];
      this.handleFiles([selectedFiles[0]]);
    } else if (!this.allowMultiple && selectedFiles.length === 1) {
      // When allowMultiple is false, replace existing files
      this.files = [];
      this.fileUploadStates = [];
      this.fileLoadProgress = [];
      this.handleFiles(selectedFiles);
    } else {
      this.handleFiles(selectedFiles);
    }
  }

  handleFiles(filesArray: File[]) {
    const maxBytes = this.maxFileSizeMb * 1024 * 1024;
    let filesToAdd: File[] = [];
    let statesToAdd: Array<'idle' | 'ready' | 'uploading' | 'success' | 'error'> = [];
    let progressToAdd: number[] = [];
    let limit = this.allowMultiple ? filesArray.length : Math.min(filesArray.length, 1);
    for (let i = 0; i < limit; i++) {
      const file = filesArray[i];
      if (file.size > maxBytes) {
        this.showToastMsg('error', `Le fichier ${file.name} dépasse la taille maximale de ${this.maxFileSizeMb} Mo.`);
        continue;
      }
      // Check for duplicate (same name and size)
      const duplicate = this.files.some(f => f.name === file.name && f.size === file.size);
      if (duplicate || filesToAdd.some(f => f.name === file.name && f.size === file.size)) {
        this.showToastMsg('info', `Le fichier "${file.name}" existe déjà.`);
        continue;
      }
      filesToAdd.push(file);
      statesToAdd.push('idle');
      progressToAdd.push(0);
      this.simulateFileLoad(this.files.length + filesToAdd.length - 1, file);
    }
    this.files.push(...filesToAdd);
    this.fileUploadStates.push(...statesToAdd);
    this.fileLoadProgress.push(...progressToAdd);
  }

  simulateFileLoad(index: number, file: File) {
    // Simulate file load progress (since File API doesn't provide progress for local files)
    let progress = 0;
    const step = () => {
      if (progress < 100) {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress > 100) progress = 100;
        this.fileLoadProgress[index] = progress;
        setTimeout(step, 40 + Math.random() * 60);
      } else {
        this.fileUploadStates[index] = 'ready';
        this.fileLoadProgress[index] = 100;
      }
    };
    step();
  }

  showToastMsg(color: string, message: string) {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, color, message });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 2500);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer?.files) {
        const droppedFiles = Array.from(event.dataTransfer.files);
        if (!this.allowMultiple && droppedFiles.length > 1) {
            this.showToastMsg('warning', 'Vous ne pouvez glisser qu\'un seul fichier.');
            // Reset files and replace with the first dropped file
            this.files = [];
            this.fileUploadStates = [];
            this.fileLoadProgress = [];
            this.handleFiles([droppedFiles[0]]);
        } else if (!this.allowMultiple && droppedFiles.length === 1) {
            // When allowMultiple is false, replace existing files
            this.files = [];
            this.fileUploadStates = [];
            this.fileLoadProgress = [];
            this.handleFiles(droppedFiles);
        } else {
            this.handleFiles(droppedFiles);
        }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.fileUploadStates.splice(index, 1);
  }

  downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }


  /**
   * Called when the user clicks the upload button. Sets each file's state to 'uploading', emits each file one by one.
   * The parent should call updateFileUploadState(index, 'success' | 'error') when upload completes.
   */
  sendFiles() {
    if (this.files.length === 0) {
      this.noFilesReady.emit();
      return;
    }
    let anyReady = false;
    for (let i = 0; i < this.files.length; i++) {
      if (this.fileUploadStates[i] === 'ready') {
        this.fileUploadStates[i] = 'uploading';
        this.fileUpload.emit({ file: this.files[i], index: i });
        anyReady = true;
      }
    }
    if (!anyReady) {
      this.noFilesReady.emit();
    }
  }

  /**
   * Called by the parent to update the upload state of a file (by index)
   */
  updateFileUploadState(index: number, state: 'success' | 'error') {
    this.fileUploadStates[index] = state;
  }

  ngOnDestroy() {}
}
