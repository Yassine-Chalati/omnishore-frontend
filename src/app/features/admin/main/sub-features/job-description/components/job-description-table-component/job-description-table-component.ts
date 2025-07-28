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
export class CvTableComponent {
  currentPage = 1;
  itemsPerPage = 7;
  @Output() filePopUpClicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  @Input() jobDescriptionFileList: JobDescriptionFile[] = [];

  showMatchingList(id:number) {
    this.router.navigate(['/admin/matching', id]);
  }

  get totalPages() {
    return Math.ceil(this.jobDescriptionFileList.length / this.itemsPerPage);
  }

  get paginatedJobDescriptionFileList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.jobDescriptionFileList.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onShowFilePopUpClicked() {
    this.filePopUpClicked.emit();
  }
}
