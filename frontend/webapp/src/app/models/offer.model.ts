import * as _ from 'lodash';

export class Offer {
  public id: number;
  public title: string;
  public name: string;
  public brand: string;
  public market: number;
  public price: number;
  public discount: string;
  public isOptimum: boolean;
  public marketInfo: { name: string, street: string };

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
      isOptimum: apiRepresentation.isOptimum,
      marketInfo: apiRepresentation.marketInfo,
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
  isOptimum?: boolean;
  marketInfo?: { name: string; street: string };
}
