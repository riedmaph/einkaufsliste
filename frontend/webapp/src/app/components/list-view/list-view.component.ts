import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';

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
export class ListViewComponent implements OnInit, AfterViewInit {

  public list: List = null;

  public form: FormGroup;

  public MAX_LENGTH: number = 140;

  @ViewChildren(ListComponent)
  private listComponents: QueryList<ListComponent>;

  constructor (
    private apiService: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      amount: [ '', Validators.required ],
      unit: [ '', Validators.required ],
      itemName: [ '', Validators.compose([
        Validators.maxLength(this.MAX_LENGTH),
        Validators.required,
      ]) ],

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
  public ngAfterViewInit (): void {
    this.listComponents.forEach(listComp => {
      listComp.onEdit.subscribe(([ oldItem, newItem ]) => this.update(oldItem, newItem));
      listComp.onRemove.subscribe(item => this.removeItem(item));
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
      const newItem: ListItem = {
        name: this.form.value.itemName,
        unit: this.form.value.unit,
        amount: this.form.value.amount,
        checked: false,
      };

      this.apiService.addItem(this.list.id, newItem).subscribe(res => {
        newItem.id = res.id;
        this.list.items.push(newItem);
        this.form.controls['itemName'].setValue('');
      });

      window.scrollTo(0, document.body.getBoundingClientRect().height);
    }
  }

  public update(oldItem: ListItem, newItem: ListItem): void {
    this.apiService.updateItem(this.list.id, oldItem.id, newItem)
      // On error: Undo by resetting values from oldItem. @TODO show warning
      .subscribe(null, () => _.merge(newItem, oldItem));
  }

  /**
   * Removes items from both, the incomplete and completed section
   *
   * @param {string[]} items The items to remove
   * @return {void}
   */
  public removeItem (item: ListItem): void {
    this.apiService.removeItem(this.list.id, item).subscribe(
      () => this.list.items.splice(this.list.items.indexOf(item), 1),
    );
  }

  public reorderItems (): void {
    return; // TODO
  }
}
