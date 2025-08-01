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
  @Output() structuredCvFormClicked = new EventEmitter<void>();
  @Output() filePopUpClicked = new EventEmitter<CvFile>();
  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return; // Adjusted for zero-based indexing
    this.loading = true; // Set loading state to true
    console.log('Navigating to page:', page); // Debugging log
    this.pageChange.emit(page); // Emit the page number

    // Simulate backend request completion
    setTimeout(() => {
      this.currentPage = page; // Update currentPage after backend response
      this.loading = false; // Reset loading state
    }, 500); // Adjust timeout to match backend response time
  }

  onShowStructuredCvFormClicked() {
    this.structuredCvFormClicked.emit();
  }

  onShowFilePopUpClicked(cv: CvFile) {
    this.filePopUpClicked.emit(cv);
  }
}
