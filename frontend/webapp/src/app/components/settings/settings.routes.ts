import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { FavouriteMarketSettingsComponent } from './favourite-market';
import { AuthGuard } from '../../services';

export const SETTINGS_ROUTES: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'favourite-markets',
        component: FavouriteMarketSettingsComponent,
      },
    ],
  },
];
