import {
  Component,
  ViewEncapsulation,
} from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'sl-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../assets/sass/sl-theme.scss',
    '../assets/sass/main.scss',
  ],
  templateUrl: 'app.template.html',
})
export class AppComponent { }
