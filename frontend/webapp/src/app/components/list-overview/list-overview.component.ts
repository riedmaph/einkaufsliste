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

import { ConfirmComponent } from '../ui-elements/confirm';

import { List } from '../../models';


@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  public lists: List[] = [ ];

  @Output()
  public onSidenavClose = new EventEmitter();

  public newListForm;

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
   * Checks the API service for the user's lists whenever the sidebar gets opened
   *
   * @return {void}
   */
  public onSidenavOpen (): void {
    this.reloadLists();
  }

  /**
   * Deletes a list after the confirmation of the user
   *
   * @param {List} list The list to delete
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
   * @param {List} list The list whose details to toggle
   * @return {void}
   */
  public toggleDetailsForList (list: List): void {
    const expanded = this.isExpanded(list);
    this.lists.forEach(l => this.expandedLists[l.id] = false);
    this.expandedLists[list.id] = !expanded;
  }

  /**
   * Whether the details of a list are currently visible
   *
   * @param {List} list The list to check for expansion
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
    });
  }
}
