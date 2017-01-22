import { Routes } from '@angular/router';

import {
  NoContentComponent,
  NoListSelectedComponent,
  LIST_VIEW_ROUTES,
  REGISTER_ROUTES,
  LOGIN_ROUTES,
} from './components';

export const ROUTES: Routes = [
  ...LIST_VIEW_ROUTES,
  ...REGISTER_ROUTES,
  ...LOGIN_ROUTES,
  { path: 'no-list-selected', component: NoListSelectedComponent },
  { path: '**',    component: NoContentComponent },
];
