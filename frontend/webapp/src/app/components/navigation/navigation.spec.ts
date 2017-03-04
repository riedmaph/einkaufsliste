import {
  inject,
  TestBed,
} from '@angular/core/testing';
import { Router } from '@angular/router';

import { NavigationComponent } from './navigation.component';
import { RouterStub, AuthServiceStub } from '../../../testing';
import {
  AuthService,
  NavigationService,
} from '../../services';

describe('NavigationComponent', () => {
  const mockRouter = new RouterStub();
  const mockAuthService = new AuthServiceStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationComponent,
        NavigationService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ NavigationComponent ], (nav: NavigationComponent) => {
    expect(nav instanceof NavigationComponent).toBe(true);
  }));

});
