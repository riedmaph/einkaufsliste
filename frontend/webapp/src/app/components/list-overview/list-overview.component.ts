import {
  Component,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';

import { List }         from '../../models';
import { ApiService }   from '../../services';
import { AuthService }  from '../../services';

@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  /** Lists of the user */
  public lists: List[] = [ ];

  @Output()
  public onSidenavClose = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    if (this.authService.loggedIn) {
      this.apiService.getAllLists().subscribe(lists => this.lists = lists);
    }
  }

  /*
   * Checks the API service for the user's lists whenever the sidebar gets
   * opened and there is not yet at least one list available to display.
   *
   * The described situation occurs after the user logged in
   * and opened the sidenav the first time. As the component was initialized
   * while the user was still not logged in, one has to make sure to reload
   * the lists at a later time.
   */
  public onSidenavOpen (): void {
    if (this.lists.length === 0) {
      this.apiService.getAllLists().subscribe(lists => this.lists = lists);
    }
  }

  public closeSidenav (): void {
    this.onSidenavClose.emit();
  }
}
