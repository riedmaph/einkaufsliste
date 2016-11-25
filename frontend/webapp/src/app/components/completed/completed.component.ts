import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

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


  public itemMenuIndex: number = -1;


  public toggleItemMenu (event: MouseEvent, index: number): void {
    if (this.itemMenuIndex === index) {
      this.itemMenuIndex = -1;
    } else {
      this.itemMenuIndex = index;
    }
  }

  /**
   * Removes an item from the completed items list, after confirmation was successful
   *
   * @param {number} index Index of element to remove
   * @returns {void}
   */
  public removeItem (index: number): void {
    let removedItems = this.completedItems.splice(index, 1);
    this.itemMenuIndex = -1;
    this.onRemove.emit(removedItems);
  }

	/**
	 * Marks an item from the completed items list as incomplete
	 *
	 * @param {number} index Index of the element to incomplete
	 * @return {void}
	 */
  public incompleteItem ( index: number): void {
    let completedItem: string[] = this.completedItems.splice(index, 1);
    this.itemMenuIndex = -1;
    this.onIncomplete.emit(completedItem[0]);
  }

}
