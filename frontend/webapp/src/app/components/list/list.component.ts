import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { ListItem } from '../../models/list-item.model';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { LIST_ITEM_NAME_MAX_LENGTH } from '../../constants';

@Component({
  selector: 'sl-list',
  templateUrl: './list.template.html',
  styleUrls: [
    './list.style.scss',
    './list.dragdrop.style.scss',
  ],
})
export class ListComponent {

  @Input()
  public items: ListItem[] = [ ];

  // drag and drop should only by possible within an <sl-list> and not between
  @Input()
  public dragModelName: string;

  @Output()
  public onRemove: EventEmitter<ListItem> = new EventEmitter<ListItem>();

  @Output()
  public onEdit: EventEmitter<ListItem> = new EventEmitter<ListItem>();

  @Output()
  public onReorder: EventEmitter<any> = new EventEmitter<any>();

  public itemMenuIndex: number = -1;
  private editableFlag: boolean = false;
  private deleteableFlag: boolean = false;
  private sortableFlag: boolean = false;
  private lastMovedItem: ListItem;

  constructor(
    private dragulaService: DragulaService,
  ) {
    this.dragulaService.dragend.subscribe(
      draggedElement => this.reorderItems(draggedElement[1]),
    );
    dragulaService.drag.subscribe((value) => {
      this.saveMovedItem(value.slice(1));
    });
  }

  /** Getter for LIST_ITEM_NAME_MAX_LENGTH */
  public get MAX_LENGTH (): number {
    return LIST_ITEM_NAME_MAX_LENGTH;
  }

  /** Setter for editableFlag */
  @Input()
  @HostBinding('attr.editable')
  public set editable (value: boolean) {
    this.editableFlag = (value != null && `${value}` !== 'false');
  }

  /** Getter for editableFlag */
  public get editable (): boolean {
    return this.editableFlag;
  }

  /** Setter for deleteableFlag */
  @Input()
  @HostBinding('attr.deleteable')
  public set deleteable (value: boolean) {
    this.deleteableFlag = (value != null && `${value}` !== 'false');
  }

  /** Getter for deleteableFlag */
  public get deleteable (): boolean {
    return this.deleteableFlag;
  }

  /** Setter for sortableFlag */
  @Input()
  @HostBinding('attr.sortable')
  public set sortable (value: boolean) {
    this.sortableFlag = (value != null && `${value}` !== 'false');
  }

  /** Getter for sortableFlag */
  public get sortable (): boolean {
    return this.sortableFlag;
  }

  /**
   * Toggles the checked state of an item and propagates the edit
   *
   * @param {ListItem} item Item to update
   * @return {void}
   */
  public toggleChecked (item: ListItem): void {
    if (this.itemMenuIndex > -1 && this.items[this.itemMenuIndex] === item) {
      this.itemMenuIndex = -1;
    }
    item.checked = !item.checked;
    this.onEdit.emit(item);
  }


  /**
   * Removes an item from the items list, after confirmation was successful
   *
   * @param {number} index Index of element to remove
   * @returns {void}
   */
  public removeItem (item: ListItem): void {
    if (this.deleteable) {
      this.onRemove.emit(item);
      this.itemMenuIndex = -1;
    }
  }

  /**
   * Toggles the visibility of the item-menu
   *
   * @param {MouseEvent} event Double click event that triggered this toggle
   * @param {number} index Index of the element whoose item-menu to toggleChecked
   * @return {void}
   */
  public toggleItemMenu (event: MouseEvent, index: number): void {
    if (this.itemMenuIndex === index) {
      this.onEdit.emit(this.items[index]);
      this.itemMenuIndex = -1;
    } else {
      this.itemMenuIndex = index;
    }
  }

  /**
   * Commits the edit on an item and propagates the changes
   *
   * @param {ListItem} item Item to update
   * @return {void}
   */
  public commitEdit (item: ListItem): void {
    if (this.editable) {
      if (item.name) {
        this.onEdit.emit(item);
      } else {
        this.removeItem(item);
      }
      this.itemMenuIndex = -1;
    }
  }

  /**
   * Handles keydown in the edit input fields. Commits changes on enter key pressed
   *
   * @param {number} keyCode Code of key pressed
   * @param {ListItem} item List item edited
   * @return {void}
   */
  public handleKeydown (keyCode: number, item: ListItem): void {
    if (keyCode === 13) {
      this.commitEdit(item);
    }
  }

  /**
   * Propagets the drag&drop information to the list-view
   * Reordering the items in this component is misleading, as they
   * are injected by the list-view
   *
   * @param {HTMLElement} movedElem element that was dragged by the user.
   * @returns {void}
   */
  public reorderItems (movedElem: HTMLElement): void {
    if (this.lastMovedItem) {
      const nextElement: any = movedElem.nextElementSibling;
      let targetIndex: number = 0;
      let newPosition: number = 0;
      const movedItemIndex = this.items.indexOf(this.lastMovedItem);

      if (nextElement && nextElement.id) {
        // determine new position
        const nextPosition = this.items.findIndex(val => (val.id === nextElement.id));
        // different handling for moving up and down
        if (nextPosition < movedItemIndex) {
          targetIndex = nextPosition;
        } else {
          targetIndex = nextPosition - 1;
        }
        targetIndex = targetIndex < 0 ? 0 : targetIndex;
        newPosition = targetIndex;
      } else {
        // new position at end
        targetIndex = this.items.length;
        newPosition = this.items.length - 1;
      }

    this.onReorder.emit([ this.lastMovedItem, newPosition, targetIndex ]);
    this.blink(movedElem);
    }
  }

  private blink (elem: HTMLElement): void {
    const blinkDuration = 250;
    const offset = 200;
    // nested timeouts to avoid race conditions
    setTimeout(() => {
      elem.classList.add('blink');
      setTimeout(() => {
        elem.classList.remove('blink');
      }, blinkDuration);
    }, offset);
  }

  private saveMovedItem (elem: HTMLElement): void {
    const movedItemIndex = this.items.findIndex(val => (val.id === elem[0].id));
    const movedItem = this.items[movedItemIndex];
    if (movedItem) {
      this.lastMovedItem = movedItem;
    }
  }
}
