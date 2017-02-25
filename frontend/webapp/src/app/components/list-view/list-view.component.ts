import {
  Component,
  OnInit,
  AfterViewInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { ListComponent } from '../list';
import {
  ApiService,
  ListApiService,
  ListItemParser,
} from '../../services';

import {
  ListItem,
  List,
  Product,
} from 'app/models';

import {
  AUTO_COMPLETION_TRIGGER_LENGTH,
  LIST_ITEM_NAME_MAX_LENGTH,
} from '../../constants';


@Component({
  selector: 'sl-list-view',
  templateUrl: './list-view.template.html',
  styleUrls: [ './list-view.style.scss' ],
})
export class ListViewComponent implements OnInit, AfterViewInit {

  public list: List = null;

  public form: FormGroup;

  @ViewChildren(ListComponent)
  private listComponents: QueryList<ListComponent>;

  constructor (
    private apiService: ApiService,
    private listApiService: ListApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private listItemParser: ListItemParser,
  ) {
    this.form = this.formBuilder.group({
      newItem: [ '', Validators.compose([
        Validators.maxLength(this.MAX_LENGTH),
        Validators.required,
      ]) ],
    });
  }

  /** Getter for LIST_ITEM_NAME_MAX_LENGTH */
  public get MAX_LENGTH (): number {
    return LIST_ITEM_NAME_MAX_LENGTH;
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
    if (this.list && this.listComponents) {
      this.listComponents.forEach(listComp => {
        listComp.onEdit.subscribe(newItem => this.updateItem(newItem));
        listComp.onRemove.subscribe(item => this.removeItem(item));
        listComp.onReorder.subscribe((tuple: [ ListItem, number, number ]) =>
          this.reorderItems(tuple[0], tuple[1], tuple[2]),
        );
      });
    }
  }

  /**
   * Propagates input change to the FormGroup
   *
   * @param {Product} value New value
   */
  public updateValue (value: Product): void {
    const parsedCurrentValue = this.listItemParser.parse(this.form.controls['newItem'].value);
    const completedValue: string = this.form.controls['newItem'].value
      .replace(parsedCurrentValue.name, value);
    this.form.controls['newItem'].setValue(completedValue);
  }

  /**
   * Adds an item to list. Grabs the values from this.form (thus requires it to be updated)
   */
  public addItem (): void {
    if (this.form.valid) {
      const newItem: ListItem = this.listItemParser.parse(this.form.value.newItem);

      this.apiService.addItem(this.list.id, newItem).subscribe(res => {
        newItem.id = res.id;
        this.list.items.push(newItem);
        this.form.controls['newItem'].setValue('');
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
  public updateItem (item: ListItem): void {
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
   * @param {number} newPosition new Position porpagated to the api
   * @param {number} targetIndex array index used for moving the item in the this.list.item
   * @return {void}
   */
  public reorderItems (movedItem: ListItem, newPosition: number, targetIndex: number): void {
    const movedItemIndex = this.list.items.indexOf(movedItem);
    // insert the moved Item at new position
    this.list.items.splice(targetIndex, 0, ...this.list.items.splice(movedItemIndex, 1));
    movedItem.listUuid = this.list.id;
    this.apiService.reorderItem(movedItem, newPosition)
      .subscribe(() => console.info('moved item ' + movedItem.name + ' to ' + newPosition));
  }

  /**
   * Scope wrapper for ApiService.getAutoCompletion
   * @see ApiService.getAutoCompletion
   */
  public get autoCompletionFn (): (_: string) => Observable<Product[]> {
    return (str: string) => {
      const queryString = this.listItemParser.parse(str).name;
      if (queryString.length >= AUTO_COMPLETION_TRIGGER_LENGTH) {
        return this.apiService.getAutoCompletion(queryString);
      } else {
        return Observable.of(null);
      }
    };
  }

  /**
   * Event handler for editing. Ends editing on hitting the return key.
   * @param {KeyboardEvent} event
   * @param {number} keyCode
   * @param {HTMLElement} elem Element edited in
   */
  public onEditHandler (event: KeyboardEvent, keyCode: number, elem: HTMLElement) {
     if (keyCode === 13) {
        elem.contentEditable = 'false';
        this.commitEdit(elem);
     }
  }

  /**
   * Commits a list item edit
   * @param {HTMLElement} elem Input element edited in
   * @returns {void}
   */
  public commitEdit (elem: HTMLElement) {
    if (elem.textContent){
      this.list.name = elem.textContent.replace(/[\r\n\t]/g, '');
      this.listApiService.rename(this.list.id, this.list.name);
    }
  }

  public updateHighlighting (event: KeyboardEvent, inputElem: HTMLElement) {
    event.preventDefault();

    // const value = inputElem.textContent;
    // inputElem.innerText = value;

    // const originCursorPos = getCaretPosition(inputElem);

    // const parsedResult = this.listItemParser.parse(value);

    /*
    if (originCursorPos > -1) {
      const caretPosRange = document.createRange();
      caretPosRange.setStart(inputElem, originCursorPos);
      caretPosRange.setEnd(inputElem, originCursorPos);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(caretPosRange);
    }
    */
  }
}

function getCaretPosition(elem: HTMLElement): number {
  const selection: Selection = window.getSelection();
  if (selection.rangeCount) {
    const range: Range = selection.getRangeAt(0);
    if (range.commonAncestorContainer.parentNode === elem) {
      return range.endOffset;
    }
  }
  return -1;
}

function setSelection(elem, start, length) {
  const range: Range = document.createRange();
  range.setStart(elem, start);
  range.setEnd(elem, start + length);
}
