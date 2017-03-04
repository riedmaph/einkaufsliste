import {
  Component,
  OnInit,
} from '@angular/core';

import {
  OfferService,
  ApiService,
  ListCommunicationService,
  MarketApiService,
} from '../../services';
import {
  Market,
  Offer,
  List,
  ListItem,
} from '../../models';

@Component({
  selector: 'sl-offers',
  templateUrl: 'offers.template.html',
  styleUrls: [ 'offers.style.scss' ],
})
export class OffersComponent implements OnInit {

  /** Current filter query */
  public filterQuery: string = '';

  /** Favourite markets of the user */
  private markets: Market[] = [ ];

  /** Current offers at the user's favourite markets */
  private offers: Offer[] = [ ];

  /** Subset of all offers */
  private selectedOffers: Offer[] = [ ];

  /**
   * Constructor of the offers component.
   */
  constructor (
    private apiService: ApiService,
    private marketApiService: MarketApiService,
    private offerService: OfferService,
    private listCommunicationService: ListCommunicationService,
  ) { }

  /**
   * Sets the navigation title and loads favorite markets
   * as well as the according offers on init.
   *
   * @memberof OnInit
   */
  public ngOnInit () {
    this.marketApiService.getFavourites().subscribe(markets => {
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
  public addOfferToList (offer: Offer, list: List): void {
    const offerItem: ListItem = {
      name: offer.title,
      unit: null,
      amount: null,
      onSale: true,
      checked: false,
    };
    this.apiService.addItem(list.id, offerItem).subscribe();
  }

  /**
   * Sets selectedOffers to all offers matching the query text
   *
   * @return {void}
   */
  public filter (): void {
    if (this.filterQuery.length) {
      const query = this.filterQuery.toLowerCase();
      this.selectedOffers = this.offers.filter(offer =>
        offer.title.toLowerCase().includes(query)
      );
    } else {
      this.selectedOffers = this.offers;
    }
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
      this.offerService.getOffers(marketUuid).subscribe(offers => {
        this.offers = this.offers.concat(offers);
        this.filter();
      }),
    );
  }

}
