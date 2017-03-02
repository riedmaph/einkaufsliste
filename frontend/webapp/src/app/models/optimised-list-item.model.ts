import * as _ from 'lodash';

import { ListItem } from './list-item.model';
import {
  Offer,
  OfferApiRepresentation,
} from './offer.model';

export class OptimisedListItem {
  item: ListItem;
  offers?: Offer[];
  selectedOfferIndex: number;

  /**
   * Parses an otpimised list item from the API representation.
   *
   * @param {OptimisedListItemApiRepresentation} apiRepresentation The API representation to parse.
   * @return {OptimisedListItem} The parsed optimised list item.
   */
  public static fromApi (apiRepresentation: OptimisedListItemApiRepresentation): OptimisedListItem {
    return new OptimisedListItem({
      item: {
        id: apiRepresentation.id,
        name: apiRepresentation.name,
        amount: apiRepresentation.amount,
        unit: apiRepresentation.unit,
        position: apiRepresentation.position,
      },
      offers: apiRepresentation.offers.map(Offer.fromApi),
      selectedOfferIndex: apiRepresentation.offers.findIndex(offer => offer.isOptimum),
    });
  }

  constructor (data: any) {
    _.merge(this, data);
  }
}

export interface OptimisedListItemApiRepresentation {
  id: string;
  name: string;
  unit: string;
  amount: string;
  position: number;
  offers: OfferApiRepresentation[];
}
