import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeComponent,
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ HomeComponent ], (home: HomeComponent) => {
    expect(home instanceof HomeComponent).toBe(true);
  }));

  it('should start with no entries', inject([ HomeComponent ], (home: HomeComponent) => {
    expect(home.items).toEqual([ ]);
  }));

});
