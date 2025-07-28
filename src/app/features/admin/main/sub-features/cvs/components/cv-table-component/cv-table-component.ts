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
  currentPage = 1;
  itemsPerPage = 7;

  @Input() cvFileList: CvFile[] = [];
  @Output() structuredCvFormClicked = new EventEmitter<void>();
  @Output() filePopUpClicked = new EventEmitter<void>();

  get totalPages() {
    return Math.ceil(this.cvFileList.length / this.itemsPerPage);
  }

  get paginatedCvFileList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.cvFileList.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onShowStructuredCvFormClicked() {
    this.structuredCvFormClicked.emit();
  }

  onShowFilePopUpClicked() {
    this.filePopUpClicked.emit();
  }
}
