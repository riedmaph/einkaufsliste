import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import { MdDialog } from '@angular/material';

import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
    selector: 'sl-completed',
    templateUrl: 'completed.template.html',
    styleUrls: [ 'completed.style.scss' ],
})
export class CompletedComponent {

  @Input()
  public completedItems: string[] = [ ];

  @Output()
  public onRemove: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  public onIncomplete: EventEmitter<string> = new EventEmitter<string>();


  constructor(private dialog: MdDialog) { }

  /**
   * Removes an item from the completed items list, after confirmation was successful
   *
   * @param {number} index Index of element to remove
   * @returns {void}
   */
  public removeItem (index: number): void {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        let removedItems = this.completedItems.splice(index, 1);
        this.onRemove.emit(removedItems);
      }
    });
  }

  /**
   * Removes all items from the completed items list, after confirmation was successful
   *
   * @return {void}
   */
  public removeAll(): void {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        let removedItems = this.completedItems.splice(0, this.completedItems.length);
        this.onRemove.emit(removedItems);
      }
    });
  }

	/**
	 * Marks an item from the completed items list as incomplete
	 *
	 * @param {number} index Index of the element to incomplete
	 * @return {void}
	 */
  public incompleteItem ( index: number): void {
    let completedItem: string[] = this.completedItems.splice(index, 1);
    this.onIncomplete.emit(completedItem[0]);
  }

}
