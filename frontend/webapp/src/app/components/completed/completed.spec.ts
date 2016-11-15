import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { CompletedComponent } from './completed.componet';


describe('CompletedComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompletedComponent,
      ],
    }).compileComponents();
  });

  it ('should be defined', inject([ CompletedComponent ], (component) => {
    expect(component instanceof CompletedComponent).toBe(true);
  }));

  it ('should be initialized with no entries', inject([ CompletedComponent ], (component) => {
    expect(component.completedItems).toEqual([ ]);
  }));

});
