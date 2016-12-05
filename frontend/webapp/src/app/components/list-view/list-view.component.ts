import {
  Component,
  OnInit,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ListComponent } from '../list';
import { ApiService } from '../../services/api';
import {
  ListItem,
  List,
} from '../../models';

@Component({
  selector: 'sl-list-view',
  templateUrl: './list-view.template.html',
  styleUrls: [ './list-view.style.scss' ],
})
export class ListViewComponent implements OnInit, AfterContentInit {

  public list: List;

  public form: FormGroup;

  public MAX_LENGTH: number = 140;

  @ContentChildren(ListComponent)
  private listComponents: QueryList<ListComponent>

  constructor (
    private apiService: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      newEntry: [ '', Validators.maxLength(this.MAX_LENGTH) ],
    });
  }

  public get items (): ListItem[] {
    return this.list.items.filter(i => !i.checked);
  }
  public get completedItems (): ListItem[] {
    return this.list.items.filter(i => i.checked);
  }

  /**
   * Load previous entries from the API
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    this.route.data.subscribe((data: { list: List }) => {
      this.list = data.list;
    });
  }

  /**
   * @memberOf AfterViewInit
   */
  public ngAfterContentInit (): void {
    this.listComponents.forEach(listComp => {
      listComp.onRemove.subscribe(this.removeItem);
      listComp.onEdit.subscribe(this.updateItem);
      listComp.onReorder.subscribe(this.reorderItems);
    });
  }

  /**
   * Adds an item to list
   *
   * @param {Event} event Event that triggered this addition
   */
  public add (event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.list.items.push({
        name: this.form.controls['newEntry'].value,
        unit: 'stk',
        amount: 1,
        onSale: false,
        uuid: '',
        checked: false,
      });
      this.form.controls['newEntry'].setValue('');
    }
  }

  /**
   * Removes items from both, the incomplete and completed section
   *
   * @param {string[]} items The items to remove
   * @return {void}
   */
  public removeItem (item: ListItem): void {
    console.info(item);
    const itemIndex = this.list.items.indexOf(item);
    console.info(itemIndex);
    this.list.items.splice(itemIndex, 1);
    console.info(this.list);
  }

  public updateItem ([ oldItem, newItem ]: [ ListItem, ListItem ]): void {
    console.info(oldItem, newItem);
  }

  public reorderItems (): void {
    return;
  }
}
