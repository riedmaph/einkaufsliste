import { Injectable } from '@angular/core';

import { Offer, OfferApiRepresentation } from '../../models';

@Injectable()
export class OfferMapperService {

  /**
   * Maps the offer API representation to an actual offer.
   */
  public offerApiToLocal (data: OfferApiRepresentation): Offer {
    return Offer.fromApi(data);
  }

}
