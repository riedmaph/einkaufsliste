import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { CompletedComponent } from './completed.component';


describe('CompletedComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompletedComponent,
      ],
    }).compileComponents();
  });

  it('should be defined', inject([ CompletedComponent ], (component) => {
    expect(component instanceof CompletedComponent).toBe(true);
  }));

  it('should be initialized with no entries', inject([ CompletedComponent ], (component) => {
    expect(component.completedItems).toEqual([ ]);
  }));

  describe('Removing completed items', () => {
    it('should remove the entry from the completed items list',
    inject([ CompletedComponent ], (component) => {
      component.completedItems = [ 'entry1', 'entry2' ];
      component.removeItem(1);
      expect(component.completedItems).toEqual([ 'entry1' ]);
      component.removeItem(0);
      expect(component.completedItems).toEqual([ ]);
    }));
  });

  describe('Removing all completed items', () => {
    it ('should clear the completed items list',
    inject([ CompletedComponent ], (component) => {
      component.completedItems = [ 'entry1', 'entry2', 'entry3' ];
      component.removeAll();
      expect(component.completedItems).toEqual([ ]);
    }));
  });

  describe('Marking items as incomplete', () => {
    it('should remove the incomplete item from the completed items list',
    inject([ CompletedComponent ], (component) => {
      component.completedItems = [ 'entry1', 'entry2' ];
      component.incompleteItem(1);
      expect(component.completedItems).toEqual([ 'entry1' ]);
      component.incompleteItem(0);
      expect(component.completedItems).toEqual([ ]);
    }));
  });

});
