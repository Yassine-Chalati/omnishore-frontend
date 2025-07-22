import { Routes } from '@angular/router';
import { loginRoutes } from './features/admin/login/page/login.routes';
import { mainRoutes } from './features/admin/main/page/main.routes';

export const routes: Routes = [
  ...loginRoutes,
  ...mainRoutes,
  { path: '**', redirectTo: 'login', pathMatch: 'full' },

//   { path: 'fiche-poste', component: FichePostePageComponent },
//   { path: 'login', component: LoginPageComponent },
//   { path: '**', redirectTo: 'cv' }
];
