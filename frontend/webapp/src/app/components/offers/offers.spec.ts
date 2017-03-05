import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { AuthServiceStub } from '../../../testing';

import { OffersComponent } from './offers.component';
import {
  ApiService,
  ApiMapperService,
  ListCommunicationService,
  MarketApiService,
  NavigationService,
  OfferService,
} from '../../services';
import { Offer } from '../../models';

describe('NavigationComponent', () => {
  const mockApiService = new AuthServiceStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        ApiMapperService,
        ListCommunicationService,
        OffersComponent,
        { provide: ApiService, useValue: mockApiService },
        { provide: OfferService, useValue: mockApiService },
        { provide: MarketApiService, useValue: mockApiService },
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ OffersComponent ], (offers: OffersComponent) => {
    expect(offers instanceof OffersComponent).toBe(true);
  }));

  describe('Offer-list filtering', () => {

    it('should filter correctly', inject([ OffersComponent ], (offers: OffersComponent) => {

      const offerList: Offer[] = [
        {
          brand: 'Brand1',
          discount: '-10%',
          id: 12345,
          market: 54321,
          name: 'Product',
          price: 1.23,
          title: 'Product',
          isOptimum: false,
          marketInfo: {
            name: 'TestMarket',
            street: 'TestStreet',
          },
        },
        {
          brand: 'Brand2',
          discount: '-15%',
          id: 65432,
          market: 23456,
          name: 'Product2 Query',
          price: 4.56,
          title: 'Product2 Query',
          isOptimum: true,
          marketInfo: {
            name: 'TestMarket2',
            street: 'TestStreet2',
          },
        },
       ];

      offers.offers = offerList;
      expect(offers.offers).toEqual(offerList);
      expect(offers.selectedOffers).toEqual(offerList);

      const EXPECTATION = [
        {
          brand: 'Brand2',
          discount: '-15%',
          id: 65432,
          market: 23456,
          name: 'Product2 Query',
          price: 4.56,
          title: 'Product2 Query',
          isOptimum: true,
          marketInfo: {
            name: 'TestMarket2',
            street: 'TestStreet2',
          },
        },
       ];

      offers.filterQuery = 'Query';
      expect(offers.offers).toEqual(offerList);
      expect(offers.selectedOffers).toEqual(EXPECTATION);

      offers.filterQuery = 'query';
      expect(offers.offers).toEqual(offerList);
      expect(offers.selectedOffers).toEqual(EXPECTATION);

      offers.filterQuery = 'arbitrary';
      expect(offers.offers).toEqual(offerList);
      expect(offers.selectedOffers).toEqual([ ]);
    }));
  });
});
