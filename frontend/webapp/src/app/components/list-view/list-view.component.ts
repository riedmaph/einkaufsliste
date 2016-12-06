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
      newEntry: [ '', Validators.compose([
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
    this.list.items.splice(this.list.items.indexOf(item), 1);
  }

  public reorderItems (): void {
    return; // TODO
  }
}
