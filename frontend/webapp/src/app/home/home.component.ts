import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api';

@Component({
  selector: 'sl-home',
  templateUrl: './home.template.html',
  styleUrls: [ './home.style.scss' ],
})
export class HomeComponent implements OnInit {

  /**
   * Items of the list
   */
  public items: string[] = [ ];

  constructor (
    private apiService: ApiService
  ) {}

  /**
   * Temporary auto-completion provider
   */
  public acList: (_: string) => Observable<string[]> =
    (s: string) => Observable.of(
      [ 'Milk', 'Sugar', 'Chilies', 'Chocolate', 'Chicken', 'Eggs' ].filter(
        (entry) => entry.toLowerCase().startsWith(s.toLowerCase())
      )
    );

  /**
   * Load previous entries from the API
   * @memberOf OnInit
   */
  public ngOnInit () {
    this.apiService.getEntries().subscribe((entries) => this.items = entries);
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
      this.items.push(entry.value);
      entry.value = '';
    }
  }
}
