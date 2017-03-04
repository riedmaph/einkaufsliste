import {
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from './services';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'sl-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../assets/sass/sl-theme.scss',
    '../assets/sass/main.scss',
  ],
  templateUrl: 'app.template.html',
})
export class AppComponent {

  @ViewChild(MdSidenav)
  public sidenav: MdSidenav;

  constructor (
    public authService: AuthService,
    public router: Router,
  ) {
    this.router.events.subscribe(_ => {
      this.closeSidenav();
    });
  }

  /** Closes the sidenav if present */
  public closeSidenav () {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  /** Opens the sidenav if present */
  public openSidenav () {
    if (this.sidenav) {
      this.sidenav.open();
    }
  }

}
