import { Routes } from '@angular/router';
import { CvPage } from './cv-page/cv-page';

export const cvRoutes: Routes = [
  {
    path: '',
    component: CvPage,
    children: [
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
  }
];
