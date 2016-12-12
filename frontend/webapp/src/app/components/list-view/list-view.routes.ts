import { Routes } from '@angular/router';

import { ListViewComponent } from './list-view.component';
import { AuthGuard, ListResolver } from '../../services';

export const LIST_VIEW_ROUTES: Routes = [
  {
    path: 'list/:listId',
    component: ListViewComponent,
   // canActivate: [ AuthGuard ],
    resolve: {
      list: ListResolver,
    },
  },
];
