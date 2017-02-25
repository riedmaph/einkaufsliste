import { Injectable } from '@angular/core';
import {
} from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

import {
  List,
  ListItem,
  Market,
  Product,
} from '../../models';

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
 * @return {Observable<boolean>} true if user could be added 
 * i.e. user exists and isn't already participating
 */
  public addContributor (listId: string, newUser: string): Observable<boolean> {
  /*  return this.authHttp.put(API_ROUTES.lists.sharing.addContributor
      .replace(':listid', listId)
      .replace(':mail', newUser),
      { mail: newUser });*/

    return Observable.of ((newUser.indexOf('yes') !== -1));
  }

/**
 * makes api call to remove a contributor to the list contributors
 * 
 * @param {string} ListId id of the list
 */
  }

/**
 * makes api call to retrieve the list contributors
 * 
 * @param {string} listId id of the list
 */
  public getContributors (listId: string): Observable<string[]> {
  }
}
