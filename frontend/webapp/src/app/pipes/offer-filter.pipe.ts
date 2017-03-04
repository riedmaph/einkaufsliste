import { Pipe, PipeTransform } from '@angular/core';

import { Offer } from '../models';

@Pipe({ name: 'OfferFilter' })
export class OfferFilterPipe implements PipeTransform {

  /**
   * @memberof PipeTransform
   */
  public transform (offers: Offer[], market: number): Offer[] {
    return offers.filter(offer => offer.market === market);
  }
}
