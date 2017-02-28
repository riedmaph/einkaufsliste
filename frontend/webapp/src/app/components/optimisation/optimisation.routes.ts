import { Routes } from '@angular/router';

import { OptimisationComponent } from './optimisation.component';
import { OptimisationResolver } from 'app/services';

export const OPTIMISATION_ROUTES: Routes = [
  {
    path: 'list/:listId/optimisation',
    component: OptimisationComponent,
    resolve: {
      optimisedList: OptimisationResolver,
    },
  },
];
