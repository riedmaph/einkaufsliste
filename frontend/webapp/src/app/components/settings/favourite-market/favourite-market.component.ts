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
  public distance: Number= 100;
  public lat: Number;
  public long: Number;

  public showAddMenu = false;

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
  }

  /**
   * @param {string} brand Brand name
   * @returns {string} Path to image for given brand or placeholder
   */
  public resolveImage (brand: string) {
    return '/assets/img/marketPlaceholder.png';
  }

  /**
   * Removes a given market from the favourites
   * @TODO
   */
  public remove (index: number): void {
    // @TODO
  }

  /**
   * TODO: Open overlay Component
   * current: displays container 
   */
  public toggleAddMenu (): void {
    this.showAddMenu = !this.showAddMenu;
  }

  /**
   * Gets qualified markets from ApiService and filters for already favoured markets
   * stores the data into possibleMarkets list
   */
  public searchByDistance (): void {
    this.apiService.getMarketsByDistance(this.lat, this.long, this.distance)
      .subscribe( response => this.possibleMarkets = response
      .filter(market => !this.favouriteMarkets
      .find(fav => fav.id === market.id) ));
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
    this.apiService.addFavouriteMarket(newMarket.id).subscribe(res => this.possibleMarkets = res);
    this.favouriteMarkets.push(newMarket);
    // delete from possible Market list
    const index = this.possibleMarkets.findIndex(x => x.id === newMarket.id);
    this.possibleMarkets.splice(index, 1);
  }
}
