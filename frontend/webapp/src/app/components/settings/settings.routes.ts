import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { SettingsOverviewComponent } from './overview';
import { FavouriteMarketSettingsComponent } from './favourite-market';
import { SharedListsSettingsComponent } from './sharedListSettings';

import {
  AuthGuard,
  FavouriteMarketResolver,
} from '../../services';

export const SETTINGS_ROUTES: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: SettingsOverviewComponent,
      },
      {
        path: 'favourite-markets',
        component: FavouriteMarketSettingsComponent,
        resolve: {
          favourites: FavouriteMarketResolver,
        },
      },
      {
        path: 'shared-lists',
        component: SharedListsSettingsComponent,
      },
    ],
  },
];
