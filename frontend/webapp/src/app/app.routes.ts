import { Routes } from '@angular/router';

import {
  NoContentComponent,
  LIST_OVERVIEW_ROUTES,
  LIST_VIEW_ROUTES,
  LOGIN_ROUTES,
  REGISTER_ROUTES,
  SETTINGS_ROUTES,
} from './components';

export const ROUTES: Routes = [
  ...LIST_VIEW_ROUTES,
  ...REGISTER_ROUTES,
  ...LOGIN_ROUTES,
  ...LIST_OVERVIEW_ROUTES,
  ...SETTINGS_ROUTES,
  { path: '**',    component: NoContentComponent },
];
