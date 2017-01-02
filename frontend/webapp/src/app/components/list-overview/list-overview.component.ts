import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { MdDialog } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { List } from '../../models';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ApiService } from '../../services';

@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  public MAX_NAME_LENGTH: number = 32;
  public duringDrag: boolean = false;

  /** Available lists */
  public lists: List[] = [ ];

  public form: FormGroup;

  constructor (
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private dialog: MdDialog,
    private dragulaService: DragulaService,
  ) {
    this.form = this.formBuilder.group({
      listName: [ '', Validators.compose([
        Validators.required,
        Validators.maxLength(this.MAX_NAME_LENGTH),
      ]) ],
    });
    dragulaService.setOptions('draggable-listoverview', {
      removeOnSpill: true,
      moves: function (el, container, handle) {
        return handle.className === 'drag-handle';
      },
    });
    dragulaService.dropModel.subscribe((value) => {
      this.updateOrder();
    });
    dragulaService.removeModel.subscribe((value) => {
      this.updateDelete(value.slice(1)[0]);
     });
    dragulaService.drag.subscribe(() => this.duringDrag = true);
    dragulaService.dragend.subscribe(() => this.duringDrag = false);
  }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    this.route.data.subscribe((data: { lists: List[] }) => this.lists = data.lists);
  }

  /**
   * Adds a list, updates the List Array when API call is successful
   *
   * @return {void}
   */
  public addList (event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.apiService.createList(this.form.value.listName)
        .subscribe((res: { id: string}) => this.lists.push({
          name: this.form.value.listName,
          id: res.id,
          count: 0,
          items: [ ],
        }));
    }
  }
   public onEditHandler (
   event: KeyboardEvent,
   keyCode: number,
   elem: HTMLElement,
   list: List
   ) {
     if (keyCode === 13) {
       elem.contentEditable = 'false';
      this.commitEdit(list);
     }
   }

  public toggleEditable (
    event: MouseEvent | KeyboardEvent,
    elem: HTMLInputElement,
    list: List
  ) {
    if (elem.contentEditable !== 'true') {
      elem.contentEditable = 'true';
      elem.focus();
    } else {
      this.commitEdit(list);
      elem.contentEditable = 'false';
     }
   }

  public commitEdit ( list: List) {
    // update of the list is performed automatically (dragulaModel)
    const updatedList = this.lists.find( l => l.id === list.id);
    updatedList.name.replace(/[\r\n\t]/g, '');
    this.apiService.renameList(updatedList.id, updatedList.name);
  }

  public amountOpen (list: List): Number {
    const num: Number = list.items.filter( item => item.checked === false).length;
    return num;
  }

  private updateOrder (): void {
    // TODO communicate update or ordering
  }

  private updateDelete (deletedelem: HTMLElement): void {
    // lists array is updated automatically by dragula
    let dialogRef = this.dialog.open(ConfirmComponent, {
       disableClose: false,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
      const href: string = deletedelem.firstElementChild.getAttribute('href');
      this.apiService.deleteListFromOverview(href);
      } else {
        // lists is reset previous state i.e. all lists fom api
        this.apiService.getAllLists().subscribe( allLists => this.lists = allLists);
      }
    });
  }


}


