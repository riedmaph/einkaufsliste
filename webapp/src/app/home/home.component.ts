import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'sl-home',
  templateUrl: './home.template.html',
  styleUrls: [ './home.style.scss' ],
})
export class HomeComponent {

  /**
   * Items of the list
   */
  public items: string[] = [ ];

  public acList: (_: string) => Observable<string[]> =
    (s: string) => Observable.of(
      [ 'Milk', 'Sugar', 'Chilies', 'Chocolate', 'Chicken', 'Eggs' ].filter(
        (entry) => entry.toLowerCase().startsWith(s.toLowerCase())
      )
    );

  /**
   * Adds an item to list
   * 
   * @param {any} event Event that triggered this addition
   * @param {HTMLInputElement} entry Input field 
   */
  public add (event: Event, entry: HTMLInputElement) {
    event.preventDefault();

    if (entry.value) {
      this.items.push(entry.value);
      entry.value = '';
    }
  }
}
