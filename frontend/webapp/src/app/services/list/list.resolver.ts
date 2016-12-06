import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../api';
import { List } from '../../models';

@Injectable()
export class ListResolver implements Resolve<List> {

  constructor (
    private apiService: ApiService,
  ) {}

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<List> {
    return this.apiService.getList(route.params['listId']);
  }

}


@Injectable()
export class ListsResolver implements Resolve<List[]> {

  constructor (
    private apiService: ApiService,
  ) {}

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<List[]> {
    return this.apiService.getAllLists();
  }

}

