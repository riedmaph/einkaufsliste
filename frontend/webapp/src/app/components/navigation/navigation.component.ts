import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  AuthService,
  NavigationService,
} from 'app/services';

@Component({
  selector: 'sl-nav-title',
  template: '',
})
export class NavTitleComponent implements OnInit, OnDestroy {

  @Input()
  public title: string = '';

  constructor (
    public navigationService: NavigationService,
  ) { }

  /** @memberOf OnInit */
  public ngOnInit () {
    this.navigationService.title = this.title;
  }

  /** @memberOf OnDestroy */
  public ngOnDestroy () {
    this.navigationService.title = '';
  }
}

@Component({
  selector: 'sl-navigation',
  templateUrl: './navigation.template.html',
  styleUrls: [ './navigation.style.scss' ],
})
export class NavigationComponent {

  private DEFAULT_TITLE: string = 'Elisa';

  constructor (
    private navigationService: NavigationService,
    public authService: AuthService,
  ) { }

  /** @returns {Object} Navigation meta information */
  public get navigation (): { title: string } {
    return {
      title: this.navigationService.title || this.DEFAULT_TITLE,
    };
  }

}
