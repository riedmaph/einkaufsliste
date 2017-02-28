import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';

import { OptimisedList } from '../../models';

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
  public getOptimisedList(listUuid: string): Observable<OptimisedList> {
    // TODO: Implement API call
    return undefined;
  }
}
