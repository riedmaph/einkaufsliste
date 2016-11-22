import {
  inject,
  TestBed,
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services';

describe('RegisterComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AUTH_PROVIDERS,
        AuthService,
        RegisterComponent,
      ],
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ RegisterComponent ], (register: RegisterComponent) => {
    expect(register instanceof RegisterComponent).toBeTruthy();
  }));

});
