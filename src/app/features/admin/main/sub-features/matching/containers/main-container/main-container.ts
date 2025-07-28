import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ToastComponent } from '../../../../../../../core/components/toast-component/toast-component';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { MatchingTableComponent } from '../../components/matching-table-component/matching-table-component';
import { PrimaryButtonComponent } from '../../../../../../../shared/components/primary-button-component/primary-button-component';
import { Matching } from '../../../../../../../core/models/matching.model';
import { StructuredCvFormComponent } from "../../../../../../../shared/components/structured-cv-from-component/structured-cv-form-component";
import { FilePopUpComponent } from "../../../../../../../shared/components/file-pop-up-component/file-pop-up-component";


@Component({
  selector: 'app-main-container',
  imports: [PrimaryButtonComponent, MatchingTableComponent, ToastComponent, NgIf, StructuredCvFormComponent, FilePopUpComponent],
  templateUrl: './main-container.html',
  styleUrl: './main-container.css',
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('clickAnim', [
      state('default', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.93)' })),
      transition('default => clicked', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ]),
      transition('clicked => default', [
        animate('120ms cubic-bezier(.4,0,.2,1)')
      ])
    ]),
    trigger('logoCharAnim', [
      state('normal', style({ display: 'inline-block', color: '#fff', transform: 'scale(1)' })),
      state('hover', style({ display: 'inline-block', color: '#e75480' })),
      transition('normal => hover', [
        animate('0.7s cubic-bezier(.4,0,.2,1)', keyframes([
          style({ transform: 'scale(1) rotate(0deg)', offset: 0 }),
          style({ transform: 'scale(1.85) rotate(-10deg)', offset: 0.25 }),
          style({ transform: 'scale(1.7) rotate(10deg)', offset: 0.5 }),
          style({ transform: 'scale(1.85) rotate(-10deg)', offset: 0.75 }),
          style({ transform: 'scale(1) rotate(0deg)', offset: 1 })
        ]))
      ]),
      transition('hover => normal', [
        animate('0.3s cubic-bezier(.4,0,.2,1)', style({ transform: 'scale(1) rotate(0deg)', color: '#fff' }))
      ])
    ])
  ]
})
export class MainContainer {
  showUploadModal = false;
  showStructuredCvFormModal = false;
  showFilePopUpModal = false;

  openFilePopUpModal() {
    this.showFilePopUpModal = true;
  }

  closeFilePopUpModal() {
    this.showUploadModal = false;
  }

  openStructuredCvFormModal() {
    this.showStructuredCvFormModal = true;
  }

  closeStructuredCvFormModal() {
    this.showStructuredCvFormModal = false;
  }

// static data -------------------
  matchingList: Matching[] = [
    ...Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      fileName: `cv_test${i + 1}.${['pdf','docx','pptx','doc'][i%4]}`,
      addedDate: `2025-07-${(21 - (i % 30)).toString().padStart(2, '0')}`,
      imageUrl: '',
      fileType: ['PDF','DOCX','PPTX','DOC'][i%4],
      score: Math.floor(Math.random() * 100), // example score
      cvFile: {
        id: i + 1,
        fileName: `cv_test${i + 1}.${['pdf','docx','pptx','doc'][i%4]}`,
        addedDate: `2025-07-${(21 - (i % 30)).toString().padStart(2, '0')}`,
        imageUrl: '',
        fileType: ['PDF','DOCX','PPTX','DOC'][i%4],
      } // mock CvFile object
    }))
  ];
// ----------------------------
}
