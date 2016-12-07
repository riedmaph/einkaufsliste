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

  /** Available lists */
  public lists: List[] = [ ];

  constructor (
    private route: ActivatedRoute,
  ) {}

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    this.route.data.subscribe((data: { lists: List[] }) => this.lists = data.lists);
  }
}
