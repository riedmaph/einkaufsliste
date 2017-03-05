import { Routes } from '@angular/router';

import { OptimisationComponent } from './optimisation.component';
import { AuthGuard } from '../../services';

export const OPTIMISATION_ROUTES: Routes = [
  {
    path: 'list/:listId/optimisation',
    canActivate: [ AuthGuard ],
    component: OptimisationComponent,
  },
];
