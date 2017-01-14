import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../api';
import { Market } from '../../models';

@Injectable()
export class FavouriteMarketResolver implements Resolve<Market[]> {

  constructor (
    private apiService: ApiService,
  ) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Market[]> {
    return this.apiService.getFavouriteMarkets();
  }

}
