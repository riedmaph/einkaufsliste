import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * @memberOf CanActivate
   */
  public canActivate (): boolean {
    if (this.authService.loggedIn) {
      return true;
    } else {
      this.router.navigate([ 'login' ]);
      return false;
    }
  }
}
