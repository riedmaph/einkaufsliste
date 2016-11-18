import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api';
import { ListComponent } from '../list';

@Component({
  selector: 'sl-home',
  templateUrl: './home.template.html',
  styleUrls: [ './home.style.scss' ],
})
export class HomeComponent implements OnInit {

  /**
   * Items of the list
   */
  public items: Array <[ string , number ]> = [  ];
  public itemsNoTuple: string []= [];

  public showSplit: boolean = true;
  public showLengthWarning: boolean = false;

  @ViewChild(ListComponent)
  public listComponent: ListComponent;

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
    // get previously stored items and add to  this.items
    this.apiService.getEntries().subscribe((entries) => this.items = this.items.concat(entries));
    this.itemsNoTuple = this.items.map( (tuple) => tuple[0] );

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

    if (entry.value.length < 140) {
      this.items.push([ entry.value, this.items.length ] );
      this.itemsNoTuple.push(entry.value);
      entry.value = '';

      localStorage.setItem('entries', JSON.stringify(this.items));
      this.showLengthWarning = false;
    } else {
      this.showLengthWarning = true;
    }
    document.getElementById('bottom').scrollIntoView();
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
