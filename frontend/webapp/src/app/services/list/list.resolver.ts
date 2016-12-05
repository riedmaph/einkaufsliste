import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../api';

@Injectable()
export class ListResolver implements Resolve<any> {

  constructor (
    private apiService: ApiService,
  ) {}

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.apiService.getList(route.params['listId']);
  }

}
