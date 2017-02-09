import { Pipe, PipeTransform } from '@angular/core';

import { Offer } from '../models';

@Pipe({ name: 'OfferFilter' })
export class OfferFilterPipe implements PipeTransform {

  /**
   * @memberof PipeTransform
   */
  transform (offers: Offer[], market: string): Offer[] {
    return offers.filter(offer => offer.market === market);
  }
}
