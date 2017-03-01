import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  AuthService,
  NavigationService,
} from '../../services';

import { List } from '../../models';

@Component({
  selector: 'sl-nav-title',
  template: '',
})
export class NavTitleComponent implements OnInit, OnDestroy {

  @Input()
  public list: List;

  constructor (
    public navigationService: NavigationService,
  ) { }

  /** @memberOf OnInit */
  public ngOnInit () {
    this.navigationService.list = this.list;
  }

  /** @memberOf OnDestroy */
  public ngOnDestroy () {
    this.navigationService.list = null;
  }
}

@Component({
  selector: 'sl-navigation',
  templateUrl: './navigation.template.html',
  styleUrls: [ './navigation.style.scss' ],
})
export class NavigationComponent {

  private DEFAULT_TITLE: string = 'Elisa';
  private DEFAULT_SHARED: boolean = false;

  constructor (
    private navigationService: NavigationService,
    public authService: AuthService,
  ) { }

  /** @returns {Object} Navigation meta information title and shared */
  public get navigation (): { title: string, shared: boolean } {
    if (this.navigationService.list) {
      return {
        title: this.navigationService.list.name || this.DEFAULT_TITLE,
        shared: this.navigationService.list.shared || this.DEFAULT_SHARED,
      };
    } else {
      return {
        title: this.DEFAULT_TITLE,
        shared: this.DEFAULT_SHARED,
      };
    }
  }

}
