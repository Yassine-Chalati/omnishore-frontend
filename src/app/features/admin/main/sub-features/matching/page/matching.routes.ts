import { Routes } from '@angular/router';
import { MatchingPage } from './matching-page/matching-page';

export const matchingRoutes: Routes = [
  {
    path: ':id',
    component: MatchingPage,
    children: [
      
    ]
  }
];
