import { Routes } from '@angular/router';

import {
  NoContentComponent,
  LIST_VIEW_ROUTES,
  LOGIN_ROUTES,
  OFFERS_ROUTES,
  REGISTER_ROUTES,
  SETTINGS_ROUTES,
} from './components';

export const ROUTES: Routes = [
  ...LIST_VIEW_ROUTES,
  ...LOGIN_ROUTES,
  ...OFFERS_ROUTES,
  ...REGISTER_ROUTES,
  ...SETTINGS_ROUTES,
  { path: '**',    component: NoContentComponent },
];
