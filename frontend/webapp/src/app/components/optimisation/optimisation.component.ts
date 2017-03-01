import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  OptimisedList,
  OptimisedListItem,
  Offer,
} from '../../models';

@Component({
  templateUrl: 'optimisation.template.html',
  styleUrls: [ 'optimisation.style.scss' ],
})
export class OptimisationComponent implements OnInit {

  public optimisedList: OptimisedList = null;

  constructor(private route: ActivatedRoute) { }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    this.route.data.subscribe((data: { optimisedList: OptimisedList }) => {
      console.dir(data.optimisedList);
      this.optimisedList = data.optimisedList;
    });
  }

  /**
   *
   */
  public getSelectedOfferForItem(listItem: OptimisedListItem): Offer {
    return listItem.offers[listItem.selectedOfferIndex];
  }

}
