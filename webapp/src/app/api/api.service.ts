import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from './routes';

@Injectable()
export class ApiService {

  constructor (
    private http: Http
  ) {}

  public getEntries (): Observable<any> { // TODO model
    return Observable.of([ 'TEST_ENTRY_1', 'TEST_ENTRY_2' ]);
    // return this.http
      // .get(API_ROUTES.entries)
      // .map(response => response.json());
  }

}
