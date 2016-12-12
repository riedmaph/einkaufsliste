import { Routes } from '@angular/router';

import { ListOverviewComponent } from './list-overview.component';
import { AuthGuard, ListsResolver } from '../../services';

export const LIST_OVERVIEW_ROUTES: Routes = [
  {
    path: '',
    component: ListOverviewComponent,
  //  canActivate: [ AuthGuard ],
    resolve: {
      lists: ListsResolver,
    },
  },
];
