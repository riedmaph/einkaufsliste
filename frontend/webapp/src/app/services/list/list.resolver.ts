import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ListApiService } from '../list';
import { List } from '../../models';

@Injectable()
export class ListResolver implements Resolve<List> {

  constructor (
    private listApiService: ListApiService,
  ) {}

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<List> {
    return this.listApiService.getOne(route.params['listId']);
  }

}


@Injectable()
export class ListsResolver implements Resolve<List[]> {

  constructor (
    private listApiService: ListApiService,
  ) {}

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<List[]> {
    return this.listApiService.getAll();
  }

}


@Injectable()
export class DefaultListResolver implements Resolve<List> {

  constructor (
    private listApiService: ListApiService,
  ) {}

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<List> {
    return this.listApiService.getDefault().catch(err => Observable.of(null));
  }

}

