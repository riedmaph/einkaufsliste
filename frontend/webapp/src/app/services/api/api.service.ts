import { Injectable } from '@angular/core';
import {
  RequestOptionsArgs,
  URLSearchParams,
} from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

import {
  ListItem,
  Product,
} from '../../models';

import { API_ROUTES } from './routes';

@Injectable()
export class ApiService {

  constructor (
    private authHttp: AuthHttp,
  ) { }

  /**
   * Makes API call to retrieve auto completion suggestions for given input
   *
   * @param {string} input Current user input
   * @return {Observable<Product[]>} List of auto completion suggestions
   */
  public getAutoCompletion (input: string): Observable<Product[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('q', input);

    const options: RequestOptionsArgs = {
      search: queryParams,
    };

    return this.authHttp.get(API_ROUTES.products.search, options)
      .map(res => res.json().products.map(p => p.name));
  }

  /**
   * Make the API call to add a given item to a given list
   *
   * @param {string} listUuid UUID of the list to add to
   * @param {ListItem} item List item to add
   * @return {Observable<{ uuid: string }>}
   */
  public addItem (listUuid: string, item: ListItem): Observable<{ id: string }> {
    return this.authHttp.post(API_ROUTES.lists.entries.add.replace(':listId', listUuid), {
      listid: listUuid,
      name: item.name,
      checked: item.checked,
      amount: item.amount,
      unit: item.unit,
    }).map(res => res.json());
  }

  /**
   * Make API call to remove an items from a given list
   *
   * @param {string} listUuid UUID of the list to remove from
   * @param {ListItem} item List item to remove
   * @return {Observable<any>}
   */
  public removeItem (listUuid: string, item: ListItem): Observable<any> {
    return this.authHttp.delete(
      API_ROUTES.lists.entries.remove
        .replace(':listId', listUuid)
        .replace(':itemId', item.id),
    );
  }

  /**
   * Make API call to update a given item
   *
   * @param {string} listUuid UUID of the list the item is input
   * @param {string} itemId ID of the item to update
   * @param {ListItem} item Updated item
   * @return {Observable<any>}
   */
  public updateItem (listUuid: string, itemId: string, item: ListItem): Observable<any> {
    return this.authHttp.put(
      API_ROUTES.lists.entries.update
        .replace(':listId', listUuid)
        .replace(':itemId', itemId),
      item,
    );
  }

  /**
   * Makes API call to persistent reordering of items
   *
   * @param {ListItem} item moved item
   * @param {number} newPosition new position of the item
   * @return {Observable<any>}
   *
   */
  public reorderItem (item: ListItem, newPosition: number): Observable<any> {
    return this.authHttp.patch(
      API_ROUTES.lists.entries.move
        .replace(':listId', item.listUuid)
        .replace(':itemId', item.id),
      { targetposition: newPosition },
    );
  }

}
