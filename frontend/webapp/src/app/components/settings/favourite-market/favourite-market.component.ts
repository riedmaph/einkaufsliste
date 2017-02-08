import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Market } from '../../../models';
import { ApiService } from '../../../services';

@Component({
  selector: 'sl-settings',
  templateUrl: './favourite-market.template.html',
  styleUrls: [ './favourite-market.style.scss' ],
})
export class FavouriteMarketSettingsComponent implements OnInit {

  public favouriteMarkets: Market[] = [ ];
  public possibleMarkets: Market[] = [ ];

  public error: string = '';
  public distance: Number = 2500;
  public zipCode: Number;
  private showAddMenu = false;
  private showResults = false;
  private showPosition = false;
  private lat: Number = 0;
  private long: Number = 0;
  private locationInfo: String = 'https://www.google.de/maps/@lat,long,15z';

  constructor (
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) { }

  /** @memorOf OnInit */
  public ngOnInit (): void {
    this.route.data.subscribe(
      (data: { favourites: Market[] }) => {
        this.favouriteMarkets = data.favourites;
      },
      (err) => {
        this.error = err.message || 'An error occurred';
      },
    );
     navigator.geolocation.getCurrentPosition(pos => this.setPosition(pos));
  }

  /**
   * Gets qualified markets from ApiService and filters for already favoured markets
   * stores the data into possibleMarkets list
   */
  public searchByDistance (): void {
    navigator.geolocation.getCurrentPosition(pos => this.setPosition(pos));
    if (this.lat > 0) {
      // defensive guard to avoid wrong results before position is set
      this.apiService.getMarketsByDistance(this.lat, this.long, this.distance)
        .subscribe(response => this.possibleMarkets = response
        .filter(market => !this.favouriteMarkets
       .find(fav => fav.id === market.id) ));
    }
    this.showResults = true;
    this.showPosition = true;
    console.log("show position: " + this.showPosition)
  }

  /**
   * Gets qualified markets from ApiService and filters for already favoured markets
   * stores the data into possibleMarkets list
   */
  public searchByZip (): void {
    if ( this.zipCode > 0) {
      this.apiService.getMarketsByZip(this.zipCode)
        .subscribe(response => this.possibleMarkets = response
        .filter(market => !this.favouriteMarkets
        .find(fav => fav.id === market.id) ));

      this.showResults = true;
      this.showPosition = false;
    }
  }

  /**
   *  Adds a possible Market to favouriteMarkets
   *  removes the market from the possibleMarkets
   *  escalates the update to the api
   * 
   * @param {Market} newMarket the new Market
   *   
   */
  public add (newMarket: Market): void {
    this.apiService.addFavouriteMarket(newMarket.id).subscribe(_ => {
      this.favouriteMarkets.push(newMarket);
      // delete from possible Market list
      const index = this.possibleMarkets.findIndex(x => x.id === newMarket.id);
      this.possibleMarkets.splice(index, 1); },
    );
  }

  /**
   * Removes the market with the given Id from the favourites
   * and makes corresponding api call
   * 
   */
  public remove (marketId: number): void {
    this.apiService.deleteFavouriteMarket(marketId).subscribe(_ => {
      const index = this.favouriteMarkets.findIndex(x => x.id === marketId);
      this.favouriteMarkets.splice(index, 1); });
  }

  /**
   * displays container for Add controlls
   */
  public toggleAddMenu (): void {
    if (this.showAddMenu) {
      this.showResults = false;
    }
    this.showAddMenu = !this.showAddMenu;
    this.showPosition = false;
  }

  /**
   * @param {string} brand shop franchise
   * @returns {string} Path to image for given brand or placeholder   
   */
  public resolveImage (brand: string) {
    let path: string;
    switch (brand) {
      case 'EDEKA':  path = '/assets/img/brands/edeka.png'; break;
      case 'REWE': path = '/assets/img/brands/rewe.png'; break;
      default: path = '/assets/img/brands/marketPlaceholder.png';
    }
    return path;
  }

  private setPosition (position: Position): void {
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
    this.locationInfo = this.locationInfo
      .replace('lat', this.lat.toString())
      .replace('long', this.long.toString());
  }
}
