import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';
import { List } from '../../models';

import { API_ROUTES } from '../api/routes';

@Injectable()
export class ListApiService {

  constructor (
    private authHttp: AuthHttp,
  ) { }

  /**
   * Gets all lists for an authenticated user
   *
   * @return {Observable<List[]>} Observable list of the user's lists
   */
  public getAll (): Observable<List[]> {
    return this.authHttp.get(API_ROUTES.lists.all)
      .map(res => res.json().lists);
  }

  public getOne (listUuid: string): Observable<List> {
    return this.authHttp.get(API_ROUTES.lists.single.replace(':listId', listUuid))
      .map(res => res.json());
  }

  /**
   * @returns {Observable<List>} Observable with the default list or none if none is available
   */
  public getDefault (): Observable<List> {
    return this.authHttp.get(API_ROUTES.lists.default)
      .map(res => res.json());
  }

  public create (listName: string): Observable<{ id: string }> {
    return this.authHttp.post(API_ROUTES.lists.create, {
      name: listName,
    }).map(res => res.json());
  }

  /**
   * Make API call to delete a list from the list view
   *
   * @param {string} listId of the deleted list
   */
  public delete (listId: string): Observable<any> {
    return this.authHttp.delete(
      API_ROUTES.lists.single.replace(':listId', listId),
    );
  }

  /**
   * Make API call to update a list and change its name
   *
   * @param {string} listId id of the renamed list
   * @param {string} newName new name of the renamed list
   */
  public rename (listId: string, newName: string): Observable<any> {
    return this.authHttp.put(
      API_ROUTES.lists.single.replace(':listId', listId),
      { name: newName }).map( res => res.json());
  }

}
