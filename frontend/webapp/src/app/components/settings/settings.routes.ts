import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { FavouriteMarketSettingsComponent } from './favourite-market';
import {
  AuthGuard,
  FavouriteMarketResolver,
} from '../../services';

export const SETTINGS_ROUTES: Routes = [
  {
    path: 'settings',
    children: [
      {
        path: '',
        component: SettingsComponent,
      },
      {
        path: 'favourite-markets',
        component: FavouriteMarketSettingsComponent,
        resolve: {
          favourites: FavouriteMarketResolver,
        },
      },
    ],
  },
];
