import { Routes } from '@angular/router';
import { ClaimsDashboardComponent } from './components/claims-dashboard/claims-dashboard';

export const routes: Routes = [
  { path: '', component: ClaimsDashboardComponent },
  { path: 'dashboard', component: ClaimsDashboardComponent },
  { path: '**', redirectTo: '' }
];
