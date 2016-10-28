import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationComponent,
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ NavigationComponent ], (nav: NavigationComponent) => {
    expect(nav instanceof NavigationComponent).toBe(true);
  }));

});
