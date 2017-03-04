import { Routes } from '@angular/router';

import { DefaultListComponent } from '../default-list';
import { ListViewComponent } from './list-view.component';
import {
  AuthGuard,
  ListResolver,
} from 'app/services';

export const LIST_VIEW_ROUTES: Routes = [
  {
    path: 'list',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: DefaultListComponent,
        resolve: {
          list: ListResolver,
        },
      },
      {
        path: ':listId',
        component: ListViewComponent,
        resolve: {
          list: ListResolver,
        },
      },
    ],
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
