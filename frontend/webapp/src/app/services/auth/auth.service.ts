import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../api/routes';
import { tokenNotExpired, AuthHttp } from 'angular2-jwt';
import { ApiMapperService } from '../api/api-mapper.service';

@Injectable()
export class AuthService {

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private apiMapper: ApiMapperService,
  ) {}

  /**
   * Getter whether a user is logged in
   * @TODO
   */
  public get loggedIn () {
    return tokenNotExpired();
  }

  /**
   * Makes API call to register a user with given form data
   *
   * @param {{ email: string, password: string, passwordConfirmation: string }} registerData
   * @return {Observable<any>}
   */
  public register (
    registerData: { email: string, password: string, passwordConfirmation: string }
  ): Observable<any> {
    return this.http.post(
      API_ROUTES.register,
      this.apiMapper.registerDataLocalToApi(registerData)
    );
  }

}
