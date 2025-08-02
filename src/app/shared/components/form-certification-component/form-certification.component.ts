import { Component, Input, OnChanges, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-certification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-certification.component.html',
  styleUrls: ['./form-certification.component.css']
})
export class FormCertificationComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() data: any[] = [];
  certifications: any[] = [];
  @ViewChildren('textarea') textareas!: QueryList<ElementRef>;

  currentPage: number = 0; // Current page for pagination

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.certifications = this.data;
    } else {
      this.certifications = [];
    }
  }

  ngOnInit(): void {
    // No static demo data, use only input data
  }

  ngAfterViewInit(): void {
    this.adjustAllTextareaHeights();
  }

  adjustAllTextareaHeights(): void {
    setTimeout(() => {
      this.textareas.forEach(textarea => {
        this.adjustTextareaHeight(textarea.nativeElement);
      });
    }, 0);
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  adjustHeight(target: EventTarget | null): void {
    const textarea = target as HTMLTextAreaElement | null;
    if (textarea) {
      this.adjustTextareaHeight(textarea);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.certifications.length / 3);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      // Adjust heights after page change
      setTimeout(() => this.adjustAllTextareaHeights(), 0);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];

    if (this.totalPages <= 7) {
      for (let i = 0; i < this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let start: number;
      let end: number;

      if (this.currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (this.currentPage >= this.totalPages - 4) {
        start = this.totalPages - 5;
        end = this.totalPages - 1;
      } else {
        start = this.currentPage - 2;
        end = this.currentPage + 2;
      }

      for (let i = start; i <= end && i < this.totalPages - 1; i++) {
        if (i > 0) {
          visiblePages.push(i);
        }
      }
    }

    return visiblePages;
  }

  trackByFn(index: number, page: number): number {
    return page;
  }
}
