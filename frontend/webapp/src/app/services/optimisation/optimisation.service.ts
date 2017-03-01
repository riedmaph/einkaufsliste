import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';

import {
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
   * Gets the optimised list items for a given list identifier.
   *
   * @param {string} listUuid The list identifier.
   * @return {Observable<OptimisedList>} Observable containing an optimised list.
   */
  public getOptimisedList(listUuid: string): Observable<OptimisedList> {
    return this.authHttp.get(API_ROUTES.optimisation.get.replace(':listId', listUuid))
      .map(res => res.json())
      .map(list => {
        return { items: list.items.map(item => OptimisedListItem.fromApi(item)) };
      });
  }
}
