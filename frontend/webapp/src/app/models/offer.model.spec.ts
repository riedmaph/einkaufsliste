import { Offer } from './offer.model';

describe('Offer model', () => {
  describe('transformation from API model', () => {
    it('should take all values provided by the API', () => {

      const API_REP = {
        id: 'arbi-trar-yid',
        title: 'some title',
        market: 'some market',
        offerprice: 123.45,
        offerfrom: '2013-02-08 09:30:26',
        offerto: '2017-02-08 09:30:26',
        discount: '10%',
        article: {
          name: 'something',
          brand: 'some brand',
        },
      };

      const EXPECTATION = new Offer({
        id: 'arbi-trar-yid',
        title: 'some title',
        name: 'something',
        brand: 'some brand',
        market: 'some market',
        price: 123.45,
        discount: '10%',
      });

      expect(Offer.fromApi(API_REP)).toEqual(EXPECTATION);

    });

    it('should ommit superfluous values', () => {
      const BLOATED_API_REP = {
        id: 'arbi-trar-yid',
        title: 'some title',
        market: 'some market',
        offerprice: 123.45,
        offerfrom: '2013-02-08 09:30:26',
        offerto: '2017-02-08 09:30:26',
        discount: '10%',
        article: {
          name: 'something',
          brand: 'some brand',
        },
        otherValue: 'abc',
        another: { value: 'def' },
      };

      const EXPECTATION = new Offer({
        id: 'arbi-trar-yid',
        title: 'some title',
        name: 'something',
        brand: 'some brand',
        market: 'some market',
        price: 123.45,
        discount: '10%',
      });

      expect(Offer.fromApi(BLOATED_API_REP)).toEqual(EXPECTATION);
    });
  });
});
