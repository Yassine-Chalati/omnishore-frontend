import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-education',
  standalone: true,
  templateUrl: './form-education.component.html',
  styleUrls: ['./form-education.component.css'],
  imports: [CommonModule]
})
export class FormEducationComponent {
  @Input() educations: any[] = [];
  currentPage: number = 0;
  get totalPages(): number {
    return Math.ceil(this.educations.length / 4);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
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
