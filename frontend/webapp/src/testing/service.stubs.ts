import { Observable } from 'rxjs';

export class AuthServiceStub {

  public register (
    registerData: { email: string, password: string, passwordConfirmation: string },
  ): Observable<any> {
    return Observable.of(null);
  }

}

export class ApiServiceStub {
  // nothing yet
}

export class ListApiServiceStub {
  // nothing yet
}
