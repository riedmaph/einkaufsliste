import { Injectable } from '@angular/core';
import {
  RequestOptionsArgs,
  URLSearchParams,
} from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';


import { Market } from '../../models';

import { API_ROUTES } from '../api/routes';

@Injectable()
export class MarketApiService {

  constructor (
    private authHttp: AuthHttp,
  ) { }

  /**
   * Makes API call to get favourite markets of the user
   *
   * @return {Observable<Market>}
   *
   */
  public getFavourites (): Observable<Market[]> {
    return this.authHttp.get(API_ROUTES.markets.favourites.get)
      .map(res => res.json().markets);
  }

  /**
   * Makes API call to get markets by Distance
   *
   *
   * @param @TODO
   * @return {Observable<Market>}
   *
   */
  public getByDistance (lat: Number, long: Number, distance: Number): Observable<Market[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('longitude', long.toString());
    queryParams.set('latitude', lat.toString());
    queryParams.set('max-distance', distance.toString());

    const options: RequestOptionsArgs = {
      search: queryParams,
    };
    return this.authHttp.get(API_ROUTES.markets.search, options)
      .map(res => res.json().markets);
  }

  /**
   * Makes API call to get markets for the user by ZIP
   *
   *
   * @param {Number} zip Zip Code
   * @return {Observable<Market>}
   *
   */
  public getByZip (zip: Number): Observable<Market[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('zip', zip.toString());
    const options: RequestOptionsArgs = {
      search: queryParams,
    };
    return this.authHttp.get(API_ROUTES.markets.search, options)
      .map(res => res.json().markets);
  }

  /**
   * Makes API call to add a market to the favourite markets
   *
   * @TODO Parameter, @TODO json.new -> json.markets
   * @param The Id of the new favourite market
   * @return {Observable<any>}
   *
   */
  public addFavourite (marketId: Number): Observable<any> {
    return this.authHttp.post(API_ROUTES.markets.favourites.add
      .replace(':marketId', marketId.toString()),
      { marketid: marketId });
  }

  /**
   * Makes API call to remove a market from the favourite markets
   *
   * @param The Id of the favourite market to delete
   * @return {Observable<any>}
   *
   */
  public removeFavourite (marketId: Number): Observable<any> {
    return this.authHttp.delete(API_ROUTES.markets.favourites.remove
      .replace(':marketId', marketId.toString()));
  }
}
