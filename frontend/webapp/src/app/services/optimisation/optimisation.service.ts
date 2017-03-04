import { Injectable } from '@angular/core';
import {
  Headers,
  RequestOptionsArgs,
  URLSearchParams,
} from '@angular/http';

import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';

import {
  ListItem,
  OptimisedList,
  OptimisedListItem,
} from '../../models';

import { API_ROUTES } from '../api/routes';

@Injectable()
export class OptimisationService {

  /**
   * Constructor of the offer service.
   */
  constructor (private authHttp: AuthHttp) { }

  /**
   * Gets the optimised list for a given list identifier.
   *
   * @param {string} listUuid The list identifier.
   * @param {string} optimisedBy The optimisation criteria - either 'price' or 'distance'
   * @param {number} longitude The user location's longitude.
   * @param {number} latitude The user location's latitude.
   * @return {Observable<OptimisedList>} Observable containing an optimised list.
   */
  public getOptimisedList (
    listUuid: string,
    optimisedBy: string,
    longitude: number,
    latitude: number,
  ): Observable<OptimisedList> {

    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('by', optimisedBy);
    queryParams.set('longitude', longitude.toString());
    queryParams.set('latitude', latitude.toString());

    const options: RequestOptionsArgs = {
      search: queryParams,
    };

    return this.authHttp.get(API_ROUTES.optimisation.get
      .replace(':listId', listUuid), options)
      .map(res => res.json())
      .map(list => {
        return {
          items: list.items.map(OptimisedListItem.fromApi),
          amountSaved: Math.abs(list.optimisationResult.savings),
          distance: list.optimisationResult.distance,
        };
      });
  }

  /**
   * Updates the optimised list by choosing a given item.
   *
   * @param {string} listUuid The list identifier.
   * @param {ListItem} itemId The selected item.
   * @param {number} longitude The user location's longitude.
   * @param {number} latitude The user location's latitude.
   * @return {Observable<any>} Observable containing the response.
   */
  public updateSelectedItem (
    listUuid: string,
    longitude: number,
    latitude: number,
    item: ListItem,
  ): Observable<any> {

    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('longitude', longitude.toString());
    queryParams.set('latitude', latitude.toString());

    const options: RequestOptionsArgs = {
      search: queryParams,
    };

    return this.authHttp.put(API_ROUTES.optimisation.update
      .replace(':listId', listUuid)
      .replace(':itemId', item.id), item, options)
      .map(res => res.json());
  }

  /**
   * Saves an optimised list with a given list identifier.
   *
   * @param {string} listUuid The list identifier.
   * @return {Observable<any>} Observable containing the response.
   */
  public saveOptimisedList (listUuid: string): Observable<any> {
    const headers = new Headers({ 'x-copy-optimised': true });
    return this.authHttp.post(API_ROUTES.optimisation.save
      .replace(':listId', listUuid), { }, { headers: headers });
  }
}
