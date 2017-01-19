import { Component } from '@angular/core';

import { Offer } from '../../models';

@Component({
  selector: 'sl-offers',
  templateUrl: 'offers.template.html',
  styleUrls: [ 'offers.style.scss' ],
})
export class OffersComponent {

  /** Current offers at the user's favourite markets */
  public offers: Offer[] = [ ];
}
