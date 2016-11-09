import { Routes } from '@angular/router';

import { HOME_ROUTES } from './components/home';
import { NoContentComponent } from './components/no-content';

export const ROUTES: Routes = [
  ...HOME_ROUTES,
  { path: '**',    component: NoContentComponent },
];
