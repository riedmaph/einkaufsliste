import { Routes } from '@angular/router';

import {
  NoContentComponent,
  HOME_ROUTES,
  REGISTER_ROUTES,
  LOGIN_ROUTES,
} from './components';

export const ROUTES: Routes = [
  ...HOME_ROUTES,
  ...REGISTER_ROUTES,
  ...LOGIN_ROUTES,
  { path: '**',    component: NoContentComponent },
];
