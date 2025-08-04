import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { Matching } from '../../../../../../../core/models/matching.model';
import { PrimaryButtonComponent } from "../../../../../../../shared/components/primary-button-component/primary-button-component";

@Component({
  selector: 'app-matching-table-component',
  imports: [NgFor, NgIf, DecimalPipe, PrimaryButtonComponent],
  templateUrl: './matching-table-component.html',
  styleUrl: './matching-table-component.css',
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
export class MatchingTableComponent {
  currentPage = 1;
  itemsPerPage = 7;

  @Input() matchingList: Matching[] = [];
  @Output() clickedStructuredCvForm = new EventEmitter<number>(); // Changed to emit CV ID
  @Output() clickedFilePopUp = new EventEmitter<any>();

  get totalPages() {
    return Math.ceil(this.matchingList.length / this.itemsPerPage);
  }

  get paginatedMatchingList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.matchingList.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

   onShowStructuredCvFormClicked(cvFileId: number) {
    console.log('Emitting CV ID for structured form:', cvFileId);
    this.clickedStructuredCvForm.emit(cvFileId);
  }

  onShowFilePopUpClicked(cvFile: any) {
    this.clickedFilePopUp.emit(cvFile);
  }
}
