import { Routes } from '@angular/router';

import { HOME_ROUTES } from './home';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  ...HOME_ROUTES,
  { path: '**',    component: NoContentComponent },
];
