import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { ListComponent } from './list.component';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';

describe('ListComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListComponent,
        DragulaService,
      ],
      imports: [
        DragulaModule,
      ],
    }).compileComponents();
  });

  it('should be defined', inject([ ListComponent ], (list: ListComponent) => {
    expect(list instanceof ListComponent).toBe(true);
  }));

  it('should be initialized with no entries', inject([ ListComponent ], (list: ListComponent) => {
    expect(list.items).toEqual([ ]);
  }));

  describe('removing entries', () => {
    it('should not fail for out of bound indices',
      inject([ ListComponent ], (list: ListComponent) => {
        expect(() => list.removeItem(-1)).not.toThrow();
        expect(list.items).toEqual([ ]);
        expect(() => list.removeItem(16)).not.toThrow();
        expect(list.items).toEqual([ ]);
      })
    );

    it('should work an an empty list', inject([ ListComponent ], (list: ListComponent) => {
      expect(list.items).toEqual([ ]);
      list.removeItem(0);
      expect(list.items).toEqual([ ]);
    }));

    it('should remove the entry from the list', inject([ ListComponent ], (list: ListComponent) => {
      list.items = [
        {
          name: 'entry1',
          unit: 'stk',
          amount: 1,
          onSale: false,
        },
        {
          name: 'entry2',
          unit: 'stk',
          amount: 1,
          onSale: false,
        } ];
      list.removeItem(1);
      expect(list.items).toEqual([ {
        name: 'entry1',
        unit: 'stk',
        amount: 1,
          onSale: false,
      } ]);
      list.removeItem(0);
      expect(list.items).toEqual([ ]);
    }));
  });

  describe('completing items', () => {
    it('should remove them from the items list', inject([ ListComponent ], (list) => {
      list.items = [ 'entry1', 'entry2' ];
      list.completeItem(1);
      expect(list.items).toEqual([ 'entry1' ]);
      list.completeItem(0);
      expect(list.items).toEqual([ ]);
    }));
  });

});
