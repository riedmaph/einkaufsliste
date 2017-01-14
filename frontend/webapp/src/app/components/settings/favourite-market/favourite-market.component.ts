import {
  Component,
  OnInit,
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

  constructor (
    private route: ActivatedRoute,
  ) { }

  public ngOnInit (): void {
    this.route.data.subscribe(
      (data: { favourites: Market[] }) => {
        this.favouriteMarkets = data.favourites;
        console.info(this.favouriteMarkets);
      },
      (err) => {
        this.error = err.message || 'An error occurred';
      }
    );
  }

  public resolveImage (brand: string) {
    return '/assets/img/marketPlaceholder.png';
  }
}
