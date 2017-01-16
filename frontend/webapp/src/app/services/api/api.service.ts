import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthHttp } from 'angular2-jwt';

import {
  List,
  ListItem,
  Market,
} from '../../models';

import { API_ROUTES } from './routes';

@Injectable()
export class ApiService {

  constructor (
    private authHttp: AuthHttp
  ) {}

  public getAllLists (): Observable<List[]> {
    return this.authHttp.get(API_ROUTES.lists.all)
      .map(res => res.json().lists);
  }

  public getList (listUuid: string): Observable<List> {
    return this.authHttp.get(API_ROUTES.lists.single.replace(':listId', listUuid))
      .map(res => res.json());
  }

  public createList (listName: string): Observable<{ id: string }> {
    return this.authHttp.post(API_ROUTES.lists.create, {
      name: listName,
    }).map(res => res.json());
  }

  /**
   * Makes API call to retrieve auto completion suggestions for given input
   *
   * @param {string} input Current user input
   * @return {Observable<string[]>} List of auto completion suggestions
   * @TODO
   */
  public getAutoCompletion (input: string): Observable<string[]> {
    return Observable.of([ 'Apple', 'Orange', 'Banana', 'Pear', 'Peach', 'Pineapple' ]);
    // return this.http
      // .get(API_ROUTES.autoCompletion')
      // .map(response => <string[]> response.json())
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
        .replace(':itemId', item.id)
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
      { targetposition: newPosition }
    );
  }

  /**
   * Makes API call to get favourite markets of the user
   *
   * @return {Observable<Market>}
   *
   */
  public getFavouriteMarkets (): Observable<Market[]> {
    return this.authHttp.get(API_ROUTES.markets.favourites.get)
      .map(res => res.json().markets);
  }

  /**
   * Makes API call to get markets of the user by Distance
   *
   * @TODO Parameter, @TODO json.new -> json.markets
   * @param @TODO
   * @return {Observable<Market>}
   *
   */
  public getMarketsByDistance (lat: Number, long: Number, distance: Number): Observable<Market[]> {
    return this.authHttp.get(API_ROUTES.markets.search)
      .map(res => res.json().new);
  }

  /**
   * Makes API call to add a markets to the favourite markets
   *
   * @TODO Parameter, @TODO json.new -> json.markets
   * @param The Id of the new favourite market
   * @return {Observable<any>}
   *
   */
  public addFavouriteMarket(marketId: Number): Observable<any> {
   /* return this.authHttp.post(API_ROUTES.markets.favourites.add
    .replace(':marketId', marketId)
    )
      .map(res => res.json());
      */
      return null;
  }
}
