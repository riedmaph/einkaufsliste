import {
  Component,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';

import {
  FormBuilder,
  Validators,
} from '@angular/forms';

import { MdDialog } from '@angular/material';

import {
  ApiService,
  AuthService,
} from '../../services';

import { ConfirmComponent } from '../confirm';

import { List } from '../../models';


@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  @Output()
  public onSidenavClose = new EventEmitter();

  public newListForm;

  /** Lists of the user */
  public lists: List[] = [ ];

  private expandedLists: { [ listId: string ]: boolean } = { };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MdDialog,
  ) {
    this.newListForm = this.formBuilder.group({
      listName: [ '', Validators.required ],
    });
  }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    if (this.authService.loggedIn) {
      this.reloadLists();
    }
  }

  /**
   * Checks the API service for the user's lists whenever the sidebar gets
   * opened and there is not yet at least one list available to display.
   *
   * This special situation occurs after the user logged in and opened the
   * sidenav the first time. As the component was initialized while the user was
   * still not logged in, one has to make sure to reload the lists at a later time.
   *
   * @return {void}
   */
  public onSidenavOpen (): void {
    if (this.lists.length === 0) {
      this.reloadLists();
    }
  }

  /**
   * Deletes a list after the confirmation of the user
   *
   * @param {List} The list to delete
   * @return {void}
   */
  public deleteList (list: List): void {
    this.confirmDeletionOfList(list);
  }

  /**
   * Adds a new list to the user's lists
   *
   * @return {void}
   */
  public addNewList (): void {
    if (this.newListForm.valid) {
      this.apiService.createList(this.newListForm.value.listName).subscribe(_ => {
        this.newListForm.reset();
        this.reloadLists();
      });
    }
  }

  /**
   * Triggers closing the sidenav and setting focus back to the main area
   *
   * @return {void}
   */
  public closeSidenav (): void {
    this.onSidenavClose.emit();
  }

  /**
   * Toggles the details of a given list and closes all other list details.
   *
   * @param {List} The list whose details to toggle
   * @return {void}
   */
  public toggleDetailsForList (list: List): void {
    let expanded = this.isExpanded(list);
    this.lists.forEach(l => this.expandedLists[l.id] = false);
    this.expandedLists[list.id] = !expanded;
  }

  /**
   * Whether the details of a list are currently visible
   *
   * @param {List} The list to check for expansion
   * @return {boolean} Whether the list is expanded or not
   */
  public isExpanded (list: List): boolean {
    return this.expandedLists[list.id];
  }

  private confirmDeletionOfList (list: List): void {
    let dialogRef = this.dialog.open(ConfirmComponent, {
       disableClose: false,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.apiService.deleteList(list.id).subscribe(_ => {
          this.reloadLists();
        });
      }
    });
  }

  private reloadLists (): void {
    this.apiService.getAllLists().subscribe(lists => {
      this.lists = lists;
      lists.forEach(list => this.expandedLists[list.id] = false);
    });
  }
}
