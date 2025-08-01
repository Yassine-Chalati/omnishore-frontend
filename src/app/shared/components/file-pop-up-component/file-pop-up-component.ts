import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PrimaryButtonComponent } from "../primary-button-component/primary-button-component";
import { trigger, transition, style, animate, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-file-pop-up-component',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './file-pop-up-component.html',
  styleUrls: ['./file-pop-up-component.css'],
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class FilePopUpComponent implements AfterViewInit, OnChanges {
  @Input() fileUrl: string | SafeResourceUrl | null = null;
  @Input() fileType: string = '';
  @Input() fileName: string = '';
  @Input() fileBytes: Uint8Array | ArrayBuffer | null = null;
  @Input() fileBlob: Blob | null = null;
  @Input() originalBlob: Blob | null = null;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('canvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;

  zoom = 1;
  isVisible = true;

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.fileType === 'pdf' && this.fileBytes) {
      this.setFileUrlFromBytes(this.fileBytes);
    }
    if (changes['fileUrl'] || changes['fileType'] || changes['fileBytes']) {
      this.zoom = 1;
      this.render();
    }
    if (this.fileUrl && typeof this.fileUrl === 'string') {
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    }
  }

  async render() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.error('PDF rendering is not supported in the current environment.');
      return;
    }

    if (!this.fileUrl || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.fileType === 'pdf') {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      const loadingTask = pdfjsLib.getDocument(typeof this.fileUrl === 'string' ? this.fileUrl : this.fileUrl.toString());
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: this.zoom });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    } else if (this.fileType.startsWith('image')) {
      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width * this.zoom;
        canvas.height = img.height * this.zoom;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = typeof this.fileUrl === 'string' ? this.fileUrl : this.fileUrl.toString();
    }
  }

  onZoomIn() {
    this.zoom = Math.min(this.zoom + 0.2, 5);
    this.render();
  }
  onZoomOut() {
    this.zoom = Math.max(this.zoom - 0.2, 0.2);
    this.render();
  }
  onZoomReset() {
    this.zoom = 1;
    this.render();
  }

  closePopup() {
    this.isVisible = false;
  }

  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.closed.emit();
    }
  }

  onClose() {
    this.isVisible = false;
    this.closed.emit();
  }

  setFileUrlFromBytes(byteStream: Uint8Array | ArrayBuffer, mimeType = 'application/pdf') {
    const blob = new Blob([byteStream], { type: mimeType });
    this.fileUrl = URL.createObjectURL(blob);
  }

  downloadOriginalFile() {
    if (this.fileBytes) {
      const blob = new Blob([this.fileBytes], { type: this.fileType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.fileName;
      link.click();
      URL.revokeObjectURL(link.href); // Clean up the object URL
    } else if (this.fileBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(this.fileBlob);
      link.download = this.fileName;
      link.click();
      URL.revokeObjectURL(link.href); // Clean up the object URL
    } else if (this.fileUrl) {
      const link = document.createElement('a');
      link.href = this.fileUrl.toString();
      link.download = this.fileName;
      link.click();
    }
  }
}
