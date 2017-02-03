import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

import { Offer } from '../../models';
import { OfferMapperService } from './offer-mapper.service';

import { API_ROUTES } from '../api/routes';

@Injectable()
export class OfferService {

  /**
   * Constructor of the offer service.
   */
  constructor (
    private authHttp: AuthHttp,
    private mapper: OfferMapperService,
  ) { }

  /**
   * Gets all offers for a given market identifier.
   *
   * @param {number} marketId The market identifier.
   * @return {Observable<Offer[]>} Observable containing a list of offers.
   */
  public getOffers (marketId: number): Observable<Offer[]> {
    return this.authHttp.get(API_ROUTES.markets.offers.replace(':marketId', marketId.toString()))
      .map(res => res.json())
      .map(list => list.offers.map(this.mapper.offerApiToLocal));
  }

}
