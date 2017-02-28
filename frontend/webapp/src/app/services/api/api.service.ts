import { Injectable } from '@angular/core';
import {
  RequestOptionsArgs,
  URLSearchParams,
} from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

import {
  List,
  ListItem,
  Market,
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
   * Gets all lists for an authenticated user
   *
   * @return {Observable<List[]>} Observable list of the user's lists
   */
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
   * Make API call to delete a list from the list view
   *
   * @param {string} listId of the deleted list
   */
  public deleteList (listId: string): Observable<any> {
    return this.authHttp.delete(
      API_ROUTES.lists.single.replace(':listId', listId)
    );
  }

  /**
   * Make API call to update a list and change its name
   *
   * @param {string} listId id of the renamed list
   * @param {string} newName new name of the renamed list
   */
  public renameList (listId: string, newName: string): Observable<any> {
    return this.authHttp.put(
      API_ROUTES.lists.single.replace(':listId', listId),
      { name: newName }).map(res => res.json());
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
   * Makes API call to get markets by Distance
   *
   *
   * @param @TODO
   * @return {Observable<Market>}
   *
   */
  public getMarketsByDistance (lat: Number, long: Number, distance: Number): Observable<Market[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('longitude', long.toString());
    queryParams.set('latitude', lat.toString());
    queryParams.set('max-distance', distance.toString());

    const options: RequestOptionsArgs = {
      search: queryParams,
    };
    return this.authHttp.get(API_ROUTES.markets.search, options)
      .map(res => res.json().markets);
  }

  /**
   * Makes API call to get markets for the user by ZIP
   *
   *
   * @param {Number} zip Zip Code
   * @return {Observable<Market>}
   *
   */
  public getMarketsByZip (zip: Number): Observable<Market[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('zip', zip.toString());
    const options: RequestOptionsArgs = {
      search: queryParams,
    };
    return this.authHttp.get(API_ROUTES.markets.search, options)
      .map(res => res.json().markets);
  }

  /**
   * Makes API call to add a market to the favourite markets
   *
   * @param The Id of the new favourite market
   * @return {Observable<any>}
   *
   */
  public addFavouriteMarket (marketId: Number): Observable<any> {
    return this.authHttp.post(API_ROUTES.markets.favourites.add
      .replace(':marketId', marketId.toString()),
      { marketid: marketId });
  }

  /**
   * Makes API call to remove a market from the favourite markets
   *
   * @param The Id of the favourite market to delete
   * @return {Observable<any>}
   *
   */
  public deleteFavouriteMarket (marketId: Number): Observable<any> {
    return this.authHttp.delete(API_ROUTES.markets.favourites.remove
      .replace(':marketId', marketId.toString()));
  }
}
