import { Routes } from '@angular/router';

import {
  ListViewComponent,
  OptimisationComponent,
} from 'app/components';
import {
  AuthGuard,
  ListResolver,
  OptimisationResolver,
} from 'app/services';

export const LIST_VIEW_ROUTES: Routes = [
  {
    path: 'list',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: ListViewComponent,
      },
      {
        path: ':listId',
        component: ListViewComponent,
        resolve: {
          list: ListResolver,
        },
        children: [
          {
            path: 'optimisation',
            component: OptimisationComponent,
            resolve: {
              optimisedList: OptimisationResolver,
            },
          },
        ],
      },
    ],
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
