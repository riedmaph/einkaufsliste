import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api';
import { ListComponent } from '../list';
import { CompletedComponent } from '../completed';

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
  public completedItems: string[] = [ ];

  public showCompletedSection: boolean = false;
  public showSplit: boolean = true;

  @ViewChild(ListComponent)
  public listComponent: ListComponent;

  @ViewChild(CompletedComponent)
  public completedComponent: CompletedComponent;

  constructor (
    private apiService: ApiService
  ) {}

  /**
   * Temporary auto-completion provider
   * TODO replace with api call
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
      this.items.push(entry.value);
      entry.value = '';

      localStorage.setItem('entries', JSON.stringify(this.items));
    }
  }

  /**
   * Completes an item on the list
   * 
   * @param {string} item The item to complete
   * @return {void}
   */
  public complete (item: string) {
    this.completedItems.push(item);

    localStorage.setItem('entries', JSON.stringify(this.items));
    localStorage.setItem('completed', JSON.stringify(this.completedItems));
  }

  /**
   * Marks an already completed item as incomplete
   * 
   * @param {string} item The item to mark as incomplete
   * @return {void} 
   */
  public incomplete (item: string) {
    this.items.push(item);

    localStorage.setItem('entries', JSON.stringify(this.items));
    localStorage.setItem('completed', JSON.stringify(this.completedItems));
  }

  public toggleShowCompletedSection () {
    this.showCompletedSection = !this.showCompletedSection;
  }

  public toggleSplit () {
    this.showSplit = !this.showSplit;
  }

  public get splitItems (): string[][] {
    let asObj: Object = {};
    this.items.forEach(item => {
      if (asObj.hasOwnProperty(item[0])) {
        asObj[item[0]].push(item);
      } else {
        asObj[item[0]] = [ item ];
      }
    });
    return Object.keys(asObj).map(k => asObj[k]);
  }
}
