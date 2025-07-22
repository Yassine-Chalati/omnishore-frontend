import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
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
   * Toast stack array
   */
  toasts: Array<{ id: number; color: string; message: string }> = [];
  toastIdCounter = 0;
  @Output() closed = new EventEmitter<void>();
  @Input() allowMultiple: boolean = true;
  @Input() maxFileSizeMb: number = 10;
  /**
   * Toast position: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
   */
  @Input() toastPosition: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'bottom-left';
  modalState: 'enter' | 'leave' = 'enter';

  deleteAllFiles() {
    this.files = [];
  }

  closeModal() {
    this.files = [];
    this.modalState = 'leave';
    setTimeout(() => {
      this.closed.emit();
      this.modalState = 'enter';
    }, 200); // match leave animation duration
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
      this.handleFiles(event.dataTransfer.files);
      // Debug: log and trigger upload
      console.log('Dropped files outside modal, uploading...');
      this.sendFiles();
    }
    // If dropped inside modal, do nothing (handled by onDrop)
  }
  files: File[] = [];
  dragOver = false;
  uploading = false;
  progress = 0;

  onFileSelected(event: any) {
    const selectedFiles = event.target.files as FileList;
    this.handleFiles(selectedFiles);
  }

  handleFiles(fileList: FileList) {
    const maxBytes = this.maxFileSizeMb * 1024 * 1024;
    if (!this.allowMultiple) {
      // Only accept the first file if present and valid
      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.size > maxBytes) {
          this.showToastMsg('error', `Le fichier ${file.name} dépasse la taille maximale de ${this.maxFileSizeMb} Mo.`);
          this.files = [];
        } else {
          this.files = [file];
        }
        if (fileList.length > 1) {
          this.showToastMsg('warning', 'Vous ne pouvez télécharger qu’un seul fichier à la fois.');
        }
      } else {
        this.files = [];
      }
    } else {
      let filesToAdd: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size > maxBytes) {
          this.showToastMsg('error', `Le fichier ${file.name} dépasse la taille maximale de ${this.maxFileSizeMb} Mo.`);
          continue;
        }
        filesToAdd.push(file);
      }
      this.files.push(...filesToAdd);
    }
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
      this.handleFiles(event.dataTransfer.files);
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
  }

  downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  sendFiles() {
    if (this.files.length === 0) return;
    this.uploading = true;
    this.progress = 0;
    // Simulate upload
    const interval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(interval);
        this.uploading = false;
        this.progress = 100;
        setTimeout(() => { this.progress = 0; }, 1000);
      }
    }, 120);
  }
}
