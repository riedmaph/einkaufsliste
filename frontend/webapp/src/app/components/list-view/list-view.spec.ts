import {
  inject,
  TestBed,
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ListViewComponent } from './list-view.component';
import { ApiService } from '../../services/api';
import { List } from '../../models';

import { ApiServiceStub } from '../../../testing';

describe('ListViewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        ListViewComponent,
        { provide: ActivatedRoute, useValue: null },
        { provide: FormBuilder, useValue: { group: () => null } },
      ],
      imports: [
        HttpModule,
      ],
    }).compileComponents();
  });

  it('should be defined',  inject([ ListViewComponent ], (listview: ListViewComponent) => {
    expect(listview instanceof ListViewComponent).toBe(true);
  }));


  it(
    'should split items in completed and incompleted items',
    inject([ ListViewComponent ], (listview: ListViewComponent) => {
      const list: List = {
        id: 'abc-abc-abc',
        name: 'Test List',
        items: [
          {
            name: 'entry 01',
            unit: 'stk',
            amount: 1,
            checked: false,
            onSale: false,
          },
          {
            name: 'entry 02',
            unit: 'stk',
            amount: 1,
            checked: true,
            onSale: false,
          },
        ],
      };

      listview.list = list;

      expect(listview.items).toEqual([
        {
          name: 'entry 01',
          unit: 'stk',
          amount: 1,
          checked: false,
          onSale: false,
        },
      ]);
      expect(listview.completedItems).toEqual([
        {
          name: 'entry 02',
          unit: 'stk',
          amount: 1,
          checked: true,
          onSale: false,
        },
      ]);
    })
  );

});
