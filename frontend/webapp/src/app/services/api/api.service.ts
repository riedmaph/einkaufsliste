import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { List } from '../../models';

// import { API_ROUTES } from './routes'; // TODO Currently unused import

@Injectable()
export class ApiService {

  constructor (
    private http: Http
  ) {}

  public getList (listId: string): Observable<List> {
    return Observable.of({
      uuid: 'abc-abc-abc',
      name: 'test list',
      items: [
        { uuid: '0', name: 'entry 01', checked: false, amount: 4, unit: 'ml', onSale: false },
        { uuid: '0', name: 'entry 02', checked: false, amount: 6, unit: 'L', onSale: true },
        { uuid: '0', name: 'entry 03', checked: true, amount: 2, unit: 'kg', onSale: false },
        { uuid: '0', name: 'entry 04', checked: true, amount: 12, unit: 'g', onSale: true },
      ],
    });
  }

  /**
   * Makes API call to retrieve list entries
   * @TODO
   */
  public getEntries (): Observable<any> { // TODO model
    return Observable.of(JSON.parse(localStorage.getItem('entries') || '[]'));
    // return this.http
      // .get(API_ROUTES.entries)
      // .map(response => response.json());
  }

  public getCompleted (): Observable<any> {
    return Observable.of(JSON.parse(localStorage.getItem('completed') || '[]'));
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

}
