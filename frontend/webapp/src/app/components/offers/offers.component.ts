import {
  Component,
  OnInit,
} from '@angular/core';

import { Offer } from '../../models';
import { NavigationService } from '../../services';

@Component({
  selector: 'sl-offers',
  templateUrl: 'offers.template.html',
  styleUrls: [ 'offers.style.scss' ],
})
export class OffersComponent implements OnInit {

  /** Current offers at the user's favourite markets */
  private offers: Offer[] = [ ];

  /**
   * Constructor of the offers component.
   */
  constructor(
    private navigationService: NavigationService,
  ) { }

  /**
   * @memberof OnInit
   */
  public ngOnInit (): void {
    this.navigationService.title = 'Current Offers';
  }
}
