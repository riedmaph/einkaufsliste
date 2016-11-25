/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'sl-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../assets/sass/font-awesome.scss',
    '../assets/sass/sl-theme.scss',
    '../assets/sass/main.scss',
  ],
  templateUrl: 'app.template.html',
})
export class AppComponent {

  public name: string = 'Shopping List';

}
