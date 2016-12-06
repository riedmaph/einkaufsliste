import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { List } from '../../models';

@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  public lists: List[] = [ ];

  constructor (
    private route: ActivatedRoute,
  ) {}

  public ngOnInit () {
    this.route.data.subscribe((data: { lists: List[] }) => this.lists = data.lists);
  }
}