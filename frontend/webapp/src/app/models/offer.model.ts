import * as _ from 'lodash';

export class Offer {
  id: string;
  name: string;
  brand: string;
  market: string;
  price: number;
  discount: number;

  /**
   * Return offer from an offer API representation.
   */
  public static fromApi (apiRepresentation: OfferApiRepresentation): Offer {
    return new Offer({
      id: apiRepresentation.id,
      name: apiRepresentation.product.name,
      brand: apiRepresentation.product.brand,
      price: apiRepresentation.product.price,
      discount: apiRepresentation.discount,
    });
  }

  constructor (data: any) {
    _.merge(this, data);
  }

}

export interface OfferApiRepresentation {
  id: string;
  market: string;
  offerprice: number;
  offerfrom: string;
  offerto: string;
  discount: string;
  product: { name: string; brand: string; price: number};
}
