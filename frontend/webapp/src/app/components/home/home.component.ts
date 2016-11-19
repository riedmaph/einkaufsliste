import { Component, OnInit, ViewChild } from '@angular/core';

import { ApiService } from '../../services/api';
import { ListComponent } from '../list';
import { CompletedComponent } from '../completed';
import { ListItem } from '../../models/list-item.model';

@Component({
  selector: 'sl-home',
  templateUrl: './home.template.html',
  styleUrls: [ './home.style.scss' ],
})
export class HomeComponent implements OnInit {

  /**
   * Items of the list
   */
  public items: Array <[ ListItem , number ]> = [  ];
  public itemsNoTuple: ListItem []= [];

  public showSplit: boolean = true;
  public showLengthWarning: boolean = false;

  public completedItems: ListItem[] = [ ];

  public showCompletedSection: boolean = false;

  @ViewChild(ListComponent)
  public listComponent: ListComponent;

  @ViewChild(CompletedComponent)
  public completedComponent: CompletedComponent;

  constructor (
    private apiService: ApiService
  ) {}

  /**
   * Load previous entries from the API
   * @memberOf OnInit
   */
  public ngOnInit () {
    // get previously stored items and add to  this.items
    this.apiService.getEntries().subscribe((entries) => this.items = this.items.concat(entries));
    this.itemsNoTuple = this.items.map( (tuple) => tuple[0] );

    this.apiService.getCompleted().subscribe((completed) => this.completedItems = completed);

    if (this.listComponent) {
      this.listComponent.onEdit.subscribe(() => {
        localStorage.setItem('entries', JSON.stringify(this.items));
      });
      this.listComponent.onRemove.subscribe(() => {
        localStorage.setItem('entries', JSON.stringify(this.items));
      });
    }
    if (this.completedComponent) {
      this.completedComponent.onRemove.subscribe(() => {
        localStorage.setItem('completed', JSON.stringify(this.completedItems));
      });
    }
  }

  /**
   * Adds an item to list
   * 
   * @param {any} event Event that triggered this addition
   * @param {HTMLInputElement} entry Input field 
   */
  public add (event: MouseEvent | KeyboardEvent, entry: HTMLInputElement) {
    event.preventDefault();

    if (entry.value.length < 140) {
      this.items.push([
        <ListItem> {
          name: entry.value,
          unit: 'stk',
          amount: 1,
        },
        this.items.length
      ]);
      this.itemsNoTuple.push(<ListItem> {
        name: entry.value,
        unit: 'stk',
        amount: 1,
      });

      entry.value = '';

      localStorage.setItem('entries', JSON.stringify(this.items));
      this.showLengthWarning = false;
    } else {
      this.showLengthWarning = true;
    }
    document.getElementById('bottom').scrollIntoView();
  }

  /**
   * Completes an item on the list
   * 
   * @param {ListItem} item The item to complete
   * @return {void}
   */
  public complete (item: ListItem): void {
    this.completedItems.push(item);

    localStorage.setItem('entries', JSON.stringify(this.items));
    localStorage.setItem('completed', JSON.stringify(this.completedItems));
  }

  /**
   * Marks an already completed item as incomplete
   * 
   * @param {ListItem} item The item to mark as incomplete
   * @return {void} 
   */
  public incomplete (item: ListItem): void {
    this.items.push([ item, -1 ]);

    localStorage.setItem('entries', JSON.stringify(this.items));
    localStorage.setItem('completed', JSON.stringify(this.completedItems));
  }

  /**
   * Removes items from both, the incomplete and completed section
   * 
   * @param {string[]} items The items to remove
   * @return {void}
   */
  public remove (items: string[]): void {
    localStorage.setItem('entries', JSON.stringify(this.items));
    localStorage.setItem('completed', JSON.stringify(this.completedItems));
  }

  /**
   * Toggles visibility of the completed items section
   * 
   * @return {void}
   */
  public toggleShowCompletedSection (): void {
    this.showCompletedSection = !this.showCompletedSection;
  }

}
