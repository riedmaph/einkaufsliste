import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { MarketApiService } from '../market';
import { Market } from '../../models';

@Injectable()
export class FavouriteMarketResolver implements Resolve<Market[]> {

  constructor (
    private marketApiService: MarketApiService,
  ) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Market[]> {
    return this.marketApiService.getFavourites();
  }

}
