import { Component, OnInit, ViewChild } from '@angular/core';

import { ApiService } from '../../services/api';
import { ListComponent } from '../list';
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
  public items: ListItem[] = [ ];

  @ViewChild(ListComponent)
  public listComponent: ListComponent;

  constructor (
    private apiService: ApiService
  ) {}

  /**
   * Load previous entries from the API
   * @memberOf OnInit
   */
  public ngOnInit () {
    this.apiService.getEntries().subscribe((entries) => this.items = entries);
    if (this.listComponent) {
      this.listComponent.onEdit.subscribe(() => {
        localStorage.setItem('entries', JSON.stringify(this.items));
      });
      this.listComponent.onRemove.subscribe(() => {
        localStorage.setItem('entries', JSON.stringify(this.items));
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

    if (entry.value) {
      this.items.push(<ListItem> {
        name: entry.value,
        unit: 'stk',
        amount: 1,
      });
      entry.value = '';

      localStorage.setItem('entries', JSON.stringify(this.items));
    }
  }

}
