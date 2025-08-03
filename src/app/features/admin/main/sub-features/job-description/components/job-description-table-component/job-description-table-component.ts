import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { PrimaryButtonComponent } from "../../../../../../../shared/components/primary-button-component/primary-button-component";
import { JobDescriptionFile } from '../../../../../../../core/models/job-description-file.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-description-table-component',
  imports: [NgFor, NgIf, PrimaryButtonComponent],
  templateUrl: './job-description-table-component.html',
  styleUrl: './job-description-table-component.css',
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
export class JobDescriptionTableComponent {
  @Input() jobDescriptionFileList: JobDescriptionFile[] = [];
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() filePopUpClicked = new EventEmitter<JobDescriptionFile>();

  constructor(private router: Router) {}

  showMatchingList(id:number) {
    this.router.navigate(['/admin/matching', id]);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageChange.emit(page + 1); // Convert to 1-based for backend
  }

  get paginatedJobDescriptionFileList() {
    // No local pagination, just return the list
    return this.jobDescriptionFileList;
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

  onShowFilePopUpClicked(jobFile: JobDescriptionFile) {
    this.filePopUpClicked.emit(jobFile);
  }
}
