import {
  Component,
  OnInit,
} from '@angular/core';

import {
  OfferService,
  ApiService,
} from '../../services';
import { Offer } from '../../models';

@Component({
  selector: 'sl-offers',
  templateUrl: 'offers.template.html',
  styleUrls: [ 'offers.style.scss' ],
})
export class OffersComponent implements OnInit {

  /** Current offers at the user's favourite markets */
  private offers: Offer[] = [ ];

  constructor (
    private apiService: ApiService,
    private offerService: OfferService,
  ) { }

  /**
   * @memberof OnInit
   */
  public ngOnInit () {
    this.apiService.getFavouriteMarkets().subscribe(markets =>
      this.loadOffers(markets.map(market => market.id))
    );
  }

  /**
   * Loads the offers for a given list of market identifiers and
   * appends them to the current list of offers.
   *
   * @param {string[]} marketUuids The list of market identifiers.
   * @return {void}
   */
  private loadOffers (marketUuids: number[]): void {
    marketUuids.map(marketUuid =>
      this.offerService.getOffers(marketUuid).subscribe(offers =>
        this.offers = this.offers.concat(offers)
      )
    );
  }

}
