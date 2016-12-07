import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { ListItem } from '../../models/list-item.model';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

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

  @Output()
  public onRemove: EventEmitter<ListItem> = new EventEmitter<ListItem>();

  @Output()
  public onEdit: EventEmitter<[ ListItem, ListItem ]> = new EventEmitter<[ ListItem, ListItem ]>();

  @Output()
  public onReorder: EventEmitter<any> = new EventEmitter<any>();

  public itemMenuIndex: number = -1;

  private editableFlag: boolean = false;
  private deleteableFlag: boolean = false;
  private sortableFlag: boolean = false;

  constructor(
    private dragulaService: DragulaService,
  ) {
    this.dragulaService.dragend.subscribe(
      draggedElement => this.reorderItems(draggedElement[1])
    );
  }

  @Input()
  @HostBinding('attr.editable')
  public set editable (value: boolean) {
    this.editableFlag = (value != null && `${value}` !== 'false');
  }
  public get editable (): boolean {
    return this.editableFlag;
  }

  @Input()
  @HostBinding('attr.deleteable')
  public set deleteable (value: boolean) {
    this.deleteableFlag = (value != null && `${value}` !== 'false');
  }
  public get deleteable (): boolean {
    return this.deleteableFlag;
  }

  @Input()
  @HostBinding('attr.sortable')
  public set sortable (value: boolean) {
    this.sortableFlag = (value != null && `${value}` !== 'false');
  }
  public get sortable (): boolean {
    return this.sortableFlag;
  }

  public toggleChecked (item: ListItem) {
    const oldItem = JSON.parse(JSON.stringify(item));
    item.checked = !item.checked;
    this.onEdit.emit([ oldItem, item ]);
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
    if (this.editable) {
      if (elem.contentEditable !== 'true') {
        elem.contentEditable = 'true';
        elem.focus();
      } else {
        this.commitEdit(elem, index);
        elem.contentEditable = 'false';
      }
    }
  }

  public commitEdit (elem: HTMLElement, index: number) {
    if (this.editable) {
      if (elem.textContent) {
        // deep copy
        const oldItem = JSON.parse(JSON.stringify(this.items[index]));
        this.items[index].name = elem.textContent.replace(/[\r\n\t]/g, '');
        elem.textContent = this.items[index].name;
        this.onEdit.emit([ oldItem, this.items[index] ]);
      } else {
        this.removeItem(this.items[index]);
      }
    }
  }

  public onEditHandler (
    event: KeyboardEvent,
    keyCode: number,
    elem: HTMLElement,
    index: number
  ) {
    if (this.editable) {
      if (keyCode === 13) {
        elem.contentEditable = 'false';
        this.commitEdit(elem, index);
      }
    }
  }

  /**
   * Reorders the item array according to drag and drop actions
   *
   * @param {HTMLElement} movedItem element that was dragged by the user.
   * @returns {void}
   */
  public reorderItems (movedElem: HTMLElement): void {
    let nextElement: any = movedElem.nextSibling;
    if (nextElement && nextElement.id) {
      let movedItemIndex = Number(movedElem.id);
      let movedItem = this.items[movedItemIndex];
      // delete the moved Item
      this.items.splice(movedItemIndex, 1);
      // determine new position
      const nextElementID = nextElement.id;
      let targetIndex: number = 0;
      if (nextElementID < movedItemIndex) {
        targetIndex = nextElementID;
      } else {
        targetIndex = nextElementID - 1;
      }
      // insert the moved Item at new position
      this.items.splice(targetIndex, 0, movedItem);
      this.onReorder.emit({ });
    }
    this.blink(movedElem);
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
}
