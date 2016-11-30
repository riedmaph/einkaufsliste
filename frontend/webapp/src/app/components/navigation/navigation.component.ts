import { Component } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'sl-navigation',
  templateUrl: './navigation.template.html',
  styleUrls: [ './navigation.style.scss' ],
})
export class NavigationComponent {

  constructor (
    public authService: AuthService,
  ) {}

}
