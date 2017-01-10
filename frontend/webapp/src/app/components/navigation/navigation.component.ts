import {
  Component,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'sl-navigation',
  templateUrl: './navigation.template.html',
  styleUrls: [ './navigation.style.scss' ],
})
export class NavigationComponent {

  @Output()
  public onSidenavToggle = new EventEmitter();

  constructor (
    public authService: AuthService,
  ) {}

  public toggleSidenav() {
    this.onSidenavToggle.emit();
  }

}
