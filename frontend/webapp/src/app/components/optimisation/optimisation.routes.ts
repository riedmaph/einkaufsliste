import { Routes } from '@angular/router';

import { OptimisationComponent } from './optimisation.component';

export const OPTIMISATION_ROUTES: Routes = [
  {
    path: 'list/:listId/optimisation',
    component: OptimisationComponent,
  },
];
