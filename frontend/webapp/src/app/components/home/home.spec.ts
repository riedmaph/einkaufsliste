import {
  inject,
  TestBed,
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { HomeComponent } from './home.component';
import { ApiService } from '../../services/api';

describe('HomeComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        HomeComponent,
      ],
      imports: [
        HttpModule,
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ HomeComponent ], (home: HomeComponent) => {
    expect(home instanceof HomeComponent).toBe(true);
  }));

});
