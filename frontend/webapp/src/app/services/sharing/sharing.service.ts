import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

import { API_ROUTES } from '../api/routes';

@Injectable()
export class SharingService {

  constructor (
    private authHttp: AuthHttp,
  ) { }

/**
 * makes api call to add a new contributor to the list contributors
 * 
 * @param {string} ListId id of the list
 * @param {string} newUser email adress of the new user
 * @return {Observable<any>} todo update
 */
  public addContributor (listId: string, newUser: string): Observable<any> {
     return this.authHttp.post(API_ROUTES.lists.sharing
      .replace(':listId', listId), {
        email: newUser,
      });
  }

/**
 * makes api call to remove a contributor to the list contributors
 * 
 * @param {string} ListId id of the list
 * @param {string} removedUser email adress of the user to be removed
 */
  public removeContributor (listId: string, removedUser: string): Observable<any> {
    const options = new RequestOptions({
      body: { email: removedUser },
    });

   return this.authHttp.delete(API_ROUTES.lists.sharing
      .replace(':listId', listId), options,
   );
  }

/**
 * makes api call to retrieve the list contributors
 * 
 * @param {string} listId id of the list
 */
  public getContributors (listId: string): Observable<string[]> {
    return this.authHttp.get(API_ROUTES.lists.sharing
      .replace(':listId', listId))
      .map(res => res.json().contributors.map(c => c.email));
  }
}
