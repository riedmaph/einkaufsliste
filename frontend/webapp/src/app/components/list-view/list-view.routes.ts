import { Routes } from '@angular/router';

import { DefaultListComponent } from '../default-list';
import { ListViewComponent } from './list-view.component';
import {
  AuthGuard,
  ListResolver,
  DefaultListResolver,
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
          list: DefaultListResolver,
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
