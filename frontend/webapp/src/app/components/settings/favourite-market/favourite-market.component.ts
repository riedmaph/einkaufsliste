import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Market } from '../../../models';

@Component({
  selector: 'sl-settings',
  templateUrl: './favourite-market.template.html',
  styleUrls: [ './favourite-market.style.scss' ],
})
export class FavouriteMarketSettingsComponent implements OnInit {

  public favouriteMarkets: Market[] = [ ];

  public error: string = '';
  public myModel: Number= 100;

  constructor (
    private route: ActivatedRoute,
  ) { }

  /** @memorOf OnInit */
  public ngOnInit (): void {
    this.route.data.subscribe(
      (data: { favourites: Market[] }) => {
        this.favouriteMarkets = data.favourites;
      },
      (err) => {
        this.error = err.message || 'An error occurred';
      }
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
}
