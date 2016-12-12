import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthHttp } from 'angular2-jwt';

import { List, ListItem } from '../../models';

import { API_ROUTES } from './routes';

@Injectable()
export class ApiService {

  constructor (
    private authHttp: AuthHttp
  ) {}

  public getAllLists (): Observable<List[]> {
    return this.getMockedData();

/* TO BE REVERTED!
    return this.authHttp.get(API_ROUTES.lists.all)
      .map(res => res.json().lists); */
  }

  public getList (listUuid: string): Observable<List> {
    return this.authHttp.get(API_ROUTES.lists.single.replace(':listId', listUuid))
      .map(res => res.json());
  }

  public createList (listName: string): Observable<{ id: string }> {
   return this.createListMock();
   /* return this.authHttp.post(API_ROUTES.lists.create, {
      name: listName,
    }).map(res => res.json());*/
  }

  /**
   * Make API call to delete a list from the list Overview
   *
   * @param {string} href of the deleted list
   */
  public deleteList (href: string): Observable<any> {
    return this.authHttp.delete(
      API_ROUTES.lists.single.replace('/lists/:listId', href)
    );
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
 * private Method to mock API call to get All Lists
 */
  private getMockedData(): Observable<List[]> {

  // Whole Method to be deleted! just for mocking //

    // items vv
    const newItem0: ListItem = {
      name: 'Eintrag A',
      unit: ' Kiste',
      amount: 1,
      checked: false,
    };
    const newItem1: ListItem = {
      name: 'Eintrag B',
      unit: ' Flaschen',
      amount: 3,
      checked: false,
    };
    const newItem2: ListItem = {
      name: 'Eintrag C',
      unit: 'Stück',
      amount: 17,
      checked: true,
    };
    const itemArray: ListItem[] = [ ];

    // assemble items vv
    itemArray.push(newItem0);
    itemArray.push(newItem1);
    itemArray.push(newItem2);

    // define Lists
    const newList0: List = {
      id: 'MeineCooleId_picknick', name: 'Picknick', items: itemArray, count: itemArray.length,
    };
    const newList1: List = {
      id: 'MeineCooleId_skiwochenende', name: 'Skiwochenende', items: itemArray, count: itemArray.length,
    };

    // assemble list of lists
    const lists: List[] = [ ];
    lists.push(newList0);
    lists.push(newList1);

    return Observable.of(lists);
 // Whole Method to be deleted! just for mocking */
  }

  // Whole Method to be deleted! just for mocking */
  private createListMock (): Observable<{ id: string }> {
   return Observable.of( { id: 'aNewId-12345'});
}
}
