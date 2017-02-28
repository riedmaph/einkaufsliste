import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { OptimisedList } from '../../models';
import { OptimisationService } from './optimisation.service';

@Injectable()
export class OptimisationResolver implements Resolve<OptimisedList> {

  /**
   * Constructor of the optimisation resolver.
   */
  constructor(
    private optimisationService: OptimisationService
  ) { }

  /**
   * @memberof Resolve
   */
  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Observable<OptimisedList> {
    return this.optimisationService.getOptimisedList(route.params['listId']);
  }
}
