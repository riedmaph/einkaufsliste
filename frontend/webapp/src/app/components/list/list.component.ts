import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { ListItem } from '../../models/list-item.model';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'sl-list',
  templateUrl: './list.template.html',
  styleUrls: [ './list.style.scss' ],
})
export class ListComponent {

  @Input()
  public items: ListItem[] = [ ];

  @Output()
  public onRemove: EventEmitter<ListItem[]> = new EventEmitter<ListItem[]>();

  @Output()
  public onEdit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onComplete: EventEmitter<ListItem> = new EventEmitter<ListItem>();

  public itemMenuIndex: number = -1;

  constructor(
    private dragulaService: DragulaService,
  ) {
    this.dragulaService.dragend.subscribe(
      draggedElement => this.reorderItems(draggedElement[1])
    );
  }

  /**
   * Removes an item from the items list, after confirmation was successful
   *
   * @param {number} index Index of element to remove
   * @returns {void}
   */
  public removeItem(index: number): void {
    let removedItems = this.items.splice(index, 1);
    this.itemMenuIndex = -1;
    this.onRemove.emit(removedItems);
  }

  /**
   * Moves an item from the items to the completed items list
   *
   * @param {number} index Index of the element to move to the completed items section
   * @return {void}
   */
  public completeItem (index: number): void {
    let completedItem = this.items.splice(index, 1);
    this.itemMenuIndex = -1;
    this.onComplete.emit(completedItem[0]);
  }

  public toggleItemMenu (event: MouseEvent, index: number): void {
    if (this.itemMenuIndex === index) {
      this.itemMenuIndex = -1;
    } else {
      this.itemMenuIndex = index;
    }
  }

  public toggleEditable (
    event: MouseEvent | KeyboardEvent,
    elem: HTMLInputElement,
    index: number
  ) {
    if (elem.contentEditable !== 'true') {
      elem.contentEditable = 'true';
      elem.focus();
    } else {
      this.commitEdit(elem, index);
      elem.contentEditable = 'false';
    }
  }

  public commitEdit (elem: HTMLElement, index: number) {
    if (elem.textContent) {
      this.items[index].name = elem.textContent.replace(/[\r\n\t]/g, '');
      elem.textContent = this.items[index].name;
      this.onEdit.emit({});
    } else {
      this.removeItem(index);
    }
  }

  public onEditHandler (
    event: KeyboardEvent,
    keyCode: number,
    elem: HTMLElement,
    index: number
  ) {
    if (keyCode === 13) {
      elem.contentEditable = 'false';
      this.commitEdit(elem, index);
    }
  }

  /**
   * Reorders the item array according to drag and drop actions
   *
   * @param {HTMLElement} movedItem element that was dragged by the user.
   * @returns {void}
   */
  public reorderItems( movedElem: HTMLElement): void {
    let nextElement: any = movedElem.nextSibling;
    if ( nextElement  && nextElement.id ){
      let movedItemIndex = Number(movedElem.id);
      let movedItem = this.items[movedItemIndex];
      // delete the moved Item
      this.items.splice(movedItemIndex, 1);
      // determine new position
      let nextElementID = nextElement.id;
      let targetIndex: number = 0;
      if ( nextElementID < movedItemIndex ){
        targetIndex = nextElementID;
      } else {
        targetIndex = nextElementID - 1;
      }
      // insert the moved Item at new position
      this.items.splice(targetIndex , 0, movedItem);
      this.onEdit.emit({});
    }
  }
}
