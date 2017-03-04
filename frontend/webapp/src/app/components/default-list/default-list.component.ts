import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { List } from '../../models';

@Component({
  selector: 'sl-default-list',
  templateUrl: './default-list.template.html',
})
export class DefaultListComponent implements OnInit {

  public list: List;

  constructor(
    private route: ActivatedRoute,
  ) { }

  /**
   * @memberOf OnInit
   */
  public ngOnInit () {
    this.route.data.subscribe((data: any) => {
      if (data.list) {
        this.list = data.list;
        history.replaceState({ }, 'unused parameter', `/list/${this.list.id}`);
      }
    });
  }

}
