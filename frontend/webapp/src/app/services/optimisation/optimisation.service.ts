import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

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
   * @return {Observable<OptimisedList>} Observable containing an optimised list.
   */
  public getOptimisedList (listUuid: string): Observable<OptimisedList> {
    return this.authHttp.get(API_ROUTES.optimisation.get
      .replace(':listId', listUuid)
      .replace(':optimisationMethod', 'price'))
      .map(res => res.json())
      .map(list => {
        return {
          items: list.items.map(OptimisedListItem.fromApi),
          amountSaved: Math.abs(list.optimisationResult.savings),
        };
      });
  }

  /**
   * Updates the optimised list by choosing a given item.
   *
   * @param {string} listUuid The list identifier.
   * @param {ListItem} itemId The selected item.
   * @return {Observable<any>} Observable containing the response.
   */
  public updateSelectedItem (listUuid: string, item: ListItem): Observable<any> {
    return this.authHttp.put(API_ROUTES.optimisation.update
      .replace(':listId', listUuid)
      .replace(':itemId', item.id), item)
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
