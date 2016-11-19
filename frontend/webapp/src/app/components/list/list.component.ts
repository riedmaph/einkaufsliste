import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { MdDialog } from '@angular/material';

import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'sl-list',
  templateUrl: './list.template.html',
  styleUrls: [ './list.style.scss' ],
})
export class ListComponent {

  @Input()
  public items: string[] = [ ];

  @Input()
  public baseColor: string = '#0147A7';

  @Output()
  public onRemove: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  public onEdit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onComplete: EventEmitter<string> = new EventEmitter<string>();


  constructor(private dialog: MdDialog) { }

  /**
   * Removes an item from the items list, after confirmation was successful
   *
   * @param {number} index Index of element to remove
   * @returns {void}
   */
  public removeItem(index: number): void {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        let removedItems = this.items.splice(index, 1);
        this.onRemove.emit(removedItems);
      }
    });
  }

  /**
   * Moves an item from the items to the completed items list
   *
   * @param {number} index Index of the element to move to the completed items section
   * @return {void}
   */
  public completeItem (index: number): void {
    let completedItem = this.items.splice(index, 1);
    this.onComplete.emit(completedItem[0]);
  }

  /**
   * Generates the color string for a gradient over the items
   *
   * @param {number} index Index of element
   * @returns {string} Hex-color-string
   */
  public gradientColor (index: number): string {
    if (this.items.length < 1) {
      throw 'No items';
    }
    if (index < 0 || index >= this.items.length) {
      throw 'Index of of bounds';
    }

    const maxR = parseInt(this.baseColor.substr(1, 2), 16);
    const maxG = parseInt(this.baseColor.substr(3, 2), 16);
    const maxB = parseInt(this.baseColor.substr(5, 2), 16);

    const colorRatio = (this.items.length - index) / this.items.length;

    const R = Math.floor(maxR * colorRatio) << 16;
    const G = Math.floor(maxG * colorRatio) << 8;
    const B = Math.floor(maxB * colorRatio) << 0;

    let col: string = (R + G + B).toString(16);

    while (col.length < 6) {
      col = '0' + col;
    }

    return '#' + col;
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
      this.items[index] = elem.textContent.replace(/[\r\n\t]/g, '');
      elem.textContent = this.items[index];
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

}
