import * as _ from 'lodash';

export class Offer {
  id: number;
  title: string;
  name: string;
  brand: string;
  market: number;
  price: number;
  discount: string;

  /**
   * Parses an offer from an offer API representation.
   *
   * @param {OfferApiRepresentation} apiRepresentation The API representation to parse.
   * @return {Offer} The parsed offer.
   */
  public static fromApi (apiRepresentation: OfferApiRepresentation): Offer {
    return new Offer({
      id: apiRepresentation.id,
      title: apiRepresentation.title,
      name: apiRepresentation.article.name,
      brand: apiRepresentation.article.brand,
      market: apiRepresentation.market,
      price: apiRepresentation.offerprice,
      discount: apiRepresentation.discount,
    });
  }

  constructor (data: any) {
    _.merge(this, data);
  }
}

export interface OfferApiRepresentation {
  id: number;
  title: string;
  market: number;
  offerprice: number;
  offerfrom: string;
  offerto: string;
  discount: string;
  article: { name: string; brand: string };
}
