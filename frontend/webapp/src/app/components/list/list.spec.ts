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

});
