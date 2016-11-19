import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { ListComponent } from './list.component';

describe('ListComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListComponent,
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
        },
        {
          name: 'entry2',
          unit: 'stk',
          amount: 1,
        } ];
      list.removeItem(1);
      expect(list.items).toEqual([ {
        name: 'entry1',
        unit: 'stk',
        amount: 1,
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


  describe('generated gradients', () => {
    it('throw when no entries exist', inject([ ListComponent ], (list: ListComponent) => {
      expect(() => list.gradientColor(0)).toThrow();
      expect(() => list.gradientColor(-1)).toThrow();
      expect(() => list.gradientColor(12)).toThrow();
    }));

    it('throw when index is out of bounds', inject([ ListComponent ], (list: ListComponent) => {
      list.items = [
        {
          name: 'entry1',
          unit: 'stk',
          amount: 1,
        },
      ];
      expect(() => list.gradientColor(-1)).toThrow();
      expect(() => list.gradientColor(12)).toThrow();
    }));

    it('use the base color for index 0', inject([ ListComponent ], (list: ListComponent) => {
      list.items = [
        {
          name: 'entry1',
          unit: 'stk',
          amount: 1,
        },
      ];
      expect(list.gradientColor(0).toLowerCase).toBe(list.baseColor.toLowerCase);
      list.items = [
        {
          name: 'entry1',
          unit: 'stk',
          amount: 1,
        },
        {
          name: 'entry2',
          unit: 'stk',
          amount: 1,
        },
        {
          name: 'entry3',
          unit: 'stk',
          amount: 1,
        },
      ];
      expect(list.gradientColor(0).toLowerCase).toBe(list.baseColor.toLowerCase);
    }));

    it('should be a gradient', inject([ ListComponent ], (list: ListComponent) => {
      list.items = [
        {
          name: 'entry1',
          unit: 'stk',
          amount: 1,
        },
        {
          name: 'entry2',
          unit: 'stk',
          amount: 1,
        },
        {
          name: 'entry3',
          unit: 'stk',
          amount: 1,
        },
      ];
      const COLOR_0 = parseInt(list.gradientColor(0).substr(1, 6), 16);
      const COLOR_1 = parseInt(list.gradientColor(1).substr(1, 6), 16);
      const COLOR_2 = parseInt(list.gradientColor(2).substr(1, 6), 16);

      expect(COLOR_0).toBeGreaterThan(COLOR_1);
      expect(COLOR_1).toBeGreaterThan(COLOR_2);
    }));
  });

});
