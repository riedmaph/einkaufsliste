import {
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  AuthService,
  NavigationService,
} from '../../services';

const DEFAULT_TITLE: string = 'Elisa';

@Component({
  selector: 'sl-nav-title',
  template: '<template #title><ng-content></ng-content></template>',
})
export class NavTitleComponent implements OnDestroy {

  constructor (
    private navigationService: NavigationService,
  ) { }

  @ViewChild('title')
  private set title (templateRef) {
    this.navigationService.titleTemplate = templateRef;
  }

  /** Unset the NavigationService titleTemplate */
  public ngOnDestroy () {
    this.navigationService.titleTemplate = null;
  }

}


@Component({
  selector: 'sl-navigation',
  templateUrl: './navigation.template.html',
  styleUrls: [ './navigation.style.scss' ],
})
export class NavigationComponent {

  constructor (
    public authService: AuthService,
    private navigationService: NavigationService,
  ) { }

  /** Getter for the title template from the NavigationService */
  public get titleTemplate () {
    return this.navigationService.titleTemplate;
  }

  /** Getter for constant DEFAULT_TITLE */
  public get DEFAULT_TITLE (): string {
    return DEFAULT_TITLE;
  }
}
