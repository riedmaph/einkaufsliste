import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { AutoCompletionComponent } from './auto-completion.component';

describe('AutoCompletionComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutoCompletionComponent,
      ],
    }).compileComponents();
  });

  it('should be defined',
    inject([ AutoCompletionComponent ], (acComp: AutoCompletionComponent) => {
      expect(acComp instanceof AutoCompletionComponent).toBe(true);
    })
  );

});
