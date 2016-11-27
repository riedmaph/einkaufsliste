import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

// import { API_ROUTES } from './routes'; // TODO Currently unused import

@Injectable()
export class ApiService {

  constructor (
    private http: Http
  ) {}

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
