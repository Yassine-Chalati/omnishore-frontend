import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { CvFile } from '../../../../../../../core/models/cv-file.model';
import { PrimaryButtonComponent } from "../../../../../../../shared/components/primary-button-component/primary-button-component";

@Component({
  selector: 'app-cv-table-component',
  imports: [NgFor, NgIf, PrimaryButtonComponent],
  templateUrl: './cv-table-component.html',
  styleUrl: './cv-table-component.css',
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInPage', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('350ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'translateY(-16px)' }))
      ])
    ])
  ]
})
export class CvTableComponent {
  @Input() cvFileList: CvFile[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() loading = false;
  @Output() structuredCvFormClicked = new EventEmitter<number>();
  @Output() filePopUpClicked = new EventEmitter<CvFile>();
  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page; // Update immediately for UI feedback
    this.loading = true;
    this.pageChange.emit(page);
    // Simulate backend request completion
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  onShowStructuredCvFormClicked(id: number) {
    this.structuredCvFormClicked.emit(id);
  }

  onShowFilePopUpClicked(cv: CvFile) {
    this.filePopUpClicked.emit(cv);
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    
    if (this.totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 0; i < this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // For more than 7 pages, show middle pages around current page
      let start: number;
      let end: number;
      
      if (this.currentPage <= 3) {
        // Show pages 2, 3, 4, 5 when current page is 0, 1, 2, or 3
        start = 1;
        end = 5;
      } else if (this.currentPage >= this.totalPages - 4) {
        // Show last 4 middle pages when near the end
        start = this.totalPages - 5;
        end = this.totalPages - 1;
      } else {
        // Show 2 pages before and after current page
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
