import { Routes } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { cvRoutes } from '../sub-features/cvs/page/cv.routes';
import { jobDescriptionRoutes } from '../sub-features/job-description/page/job-description.routes';

export const mainRoutes: Routes = [
  {
    path: 'admin',
    component: MainPage,
    children: [
      { path: 'cv', children: cvRoutes },
      { path: 'job-description', children: jobDescriptionRoutes },
      { path: '**', redirectTo: 'cv', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'admin', pathMatch: 'full' },
];
