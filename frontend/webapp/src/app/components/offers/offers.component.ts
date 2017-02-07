import {
  Component,
  OnInit,
} from '@angular/core';

import {
  OfferService,
  ApiService,
  ListCommunicationService,
  NavigationService,
} from '../../services';
import {
  Market,
  Offer,
  List,
  ListItem,
} from '../../models';

@Component({
  selector: 'sl-offers',
  templateUrl: 'offers.template.html',
  styleUrls: [ 'offers.style.scss' ],
})
export class OffersComponent implements OnInit {

  /** Favourite markets of the user */
  private markets: Market[] = [ ];

  /** Current offers at the user's favourite markets */
  private offers: Offer[] = [ ];

  /**
   * Constructor of the offers component.
   */
  constructor (
    private apiService: ApiService,
    private offerService: OfferService,
    private listCommunicationService: ListCommunicationService,
    private navigationService: NavigationService,
  ) { }

  /**
   * Sets the navigation title and loads favorite markets
   * as well as the according offers on init.
   *
   * @memberof OnInit
   */
  public ngOnInit () {
    this.navigationService.title = 'Current Offers';
    this.apiService.getFavouriteMarkets().subscribe(markets => {
      this.markets = markets;
      this.loadOffers(markets.map(market => market.id));
    });
  }

  /**
   * Adds an offer to a given list.
   *
   * @param {Offer} offer The offer to add to the given list.
   * @param {List} list The list to add the offer to.
   * @return {void}
   */
  private addOfferToList (offer: Offer, list: List): void {
    const offerItem: ListItem = {
        name: offer.name,
        unit: null,
        amount: null,
        onSale: true,
        checked: false,
      };
    this.apiService.addItem(list.id, offerItem).subscribe();
  }

  /**
   * Loads the offers for a given list of market identifiers and
   * appends them to the current list of offers.
   *
   * @param {number[]} marketIds The list of market identifiers.
   * @return {void}
   */
  private loadOffers (marketIds: number[]): void {
    marketIds.map(marketUuid =>
      this.offerService.getOffers(marketUuid).subscribe(offers =>
        this.offers = this.offers.concat(offers)
      )
    );
  }

}
