import {
  Component,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { ConfirmComponent } from '../ui-elements/confirm';
import { List } from 'app/models';
import {
  ApiService,
  ListApiService,
  ListCommunicationService,
} from 'app/services';

@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  @Output()
  public onListSelect: EventEmitter<any> = new EventEmitter<any>();

  public newListForm: FormGroup;

  private expandedLists: { [ listId: string ]: boolean } = { };

  constructor(
    private apiService: ApiService,
    private listApiService: ListApiService,
    private listCommunicationService: ListCommunicationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MdDialog,
  ) {
    this.newListForm = this.formBuilder.group({
      listName: [ '', Validators.required ],
    });
  }

  /** Getter for listCommunicationService.lists */
  public get lists (): List[] {
    return this.listCommunicationService.lists;
  }
  /** Setter for listCommunicationService.lists */
  public set lists (lists: List[]) {
    this.listCommunicationService.lists = lists;
  }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
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
      this.listApiService.create(this.newListForm.value.listName).subscribe(_ => {
        this.newListForm.reset();
        this.reloadLists();
      });
    }
  }

  /**
   * Reloads the lists of the overview
   *
   * @return {void}
   */
  public reloadLists (): void {
    this.listApiService.getAll().subscribe(lists => {
      this.lists = lists;
    });
  }

  /**
   * Triggers closing the sidenav and setting focus back to the main area
   *
   * @return {void}
   */
  public selectList (): void {
    this.onListSelect.emit();
  }

  /**
   * Toggles the details of a given list and closes all other list details
   *
   * @param {List} list The list which triggered toggling and closing other lists' details
   * @return {void}
   */
  public toggleListDetails (list: List): void {
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
    const dialogRef = this.dialog.open(ConfirmComponent, {
       disableClose: false,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.listApiService.delete(list.id).subscribe(_ => {
          this.reloadLists();
          this.router.navigate([ 'list' ]);
        });
      }
    });
  }

}
