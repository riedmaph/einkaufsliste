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
      amount: [ '', Validators.required ],
      unit: [ '', Validators.required ],
      itemName: [ '', Validators.compose([
        Validators.maxLength(this.MAX_LENGTH),
        Validators.required,
      ]) ],

    });
  }

  /** Getter for unchecked items */
  public get items (): ListItem[] {
    return this.list.items.filter(i => !i.checked);
  }

  /** Getter for checked items */
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
      listComp.onEdit.subscribe(newItem => this.update(newItem));
      listComp.onRemove.subscribe(item => this.removeItem(item));
      listComp.onReorder.subscribe(tuple => this.reorderItems(tuple[0], tuple[1]));
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

  /**
   * Propagate change of an item via API
   *
   * @param {ListItem} item Item that changed in its new state
   * @return {void}
   */
  public update(item: ListItem): void {
    this.apiService.updateItem(this.list.id, item.id, item)
      .subscribe(() => undefined);
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

  /**
   * Reorders the list items and
   * Propagates reordering of an item to the API
   *
   * @param {ListItem} movedItem moved item
   * @param {HTMLElement} movedElem the HTMLElement moved via drag&drop
   * @return {void}
   */
  public reorderItems (movedItem: ListItem, movedElem: HTMLElement): void {

    if (movedItem) {
      const nextElement: any = movedElem.nextSibling;
      let targetIndex: number = 0;
      let apiTo: number = 0;
      const movedItemIndex = this.list.items.indexOf(movedItem);

      if (nextElement && nextElement.id) {
        // determine new position
        const nextPosition = this.list.items.findIndex( val => val.id === nextElement.id);
        // different handling for moving up and down
        if (nextPosition < movedItemIndex) {
          targetIndex = nextPosition;
        } else {
          targetIndex = nextPosition - 1;
        }
        targetIndex = targetIndex < 0 ? 0 : targetIndex;
        apiTo = targetIndex;
      } else {
      // new position at end  
      targetIndex = this.list.items.length;
      apiTo = this.list.items.length - 1;
      }

      // insert the moved Item at new position
      this.list.items.splice(targetIndex, 0, this.list.items.splice(movedItemIndex, 1)[0]);
      movedItem.listUuid = this.list.id;
      this.apiService.reorderItem(movedItem, apiTo).subscribe(() => undefined);
      console.log("moved " + movedItem.name + " to " + apiTo);
    }
  }
}
