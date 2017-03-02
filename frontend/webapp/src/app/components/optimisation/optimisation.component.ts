import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Params,
} from '@angular/router';

import { Observable } from 'rxjs';

import {
  ListItem,
  OptimisedList,
  OptimisedListItem,
  Offer,
} from '../../models';

import { OptimisationService } from '../../services';

@Component({
  templateUrl: 'optimisation.template.html',
  styleUrls: [ 'optimisation.style.scss' ],
})
export class OptimisationComponent implements OnInit {

  public optimisedList: OptimisedList = null;
  public amountSaved: number = 0.0;

  private listUuid: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private optimisationService: OptimisationService,
  ) { }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    this.route.data.subscribe((data: { optimisedList: OptimisedList }) =>
      this.optimisedList = data.optimisedList
    );
    this.route.params.subscribe((params: Params) =>
      this.listUuid = params[ 'listId' ]
    );
  }

  /**
   * Gets the currently selected offer for a given list item.
   *
   * @param {OptimisedListItem} listItem The list item to get the offer for.
   */
  public getSelectedOfferForItem (listItem: OptimisedListItem): Offer {
    if (listItem.selectedOfferIndex >= listItem.offers.length) {
      return null;
    }
    return listItem.offers[listItem.selectedOfferIndex];
  }

  /**
   * Selects the next offer for a given list item, if it exists.
   *
   * @param {OptimisedListItem} listItem The list item to select the offer for.
   */
  public selectNextOfferForItem (listItem: OptimisedListItem) {
    if (this.existsNextOfferForItem(listItem)) {
      listItem.selectedOfferIndex += 1;
      this.updateOptimisedListWithListItem(listItem).subscribe(result =>
        this.amountSaved = result.savings
      );
    }
  }

  /**
   * Selects the previous offer for a given list item, if it exists.
   *
   * @param {OptimisedListItem} listItem The list item to select the offer for.
   */
  public selectPreviousOfferForItem (listItem: OptimisedListItem) {
    if (this.existsPreviousOfferForItem(listItem)) {
      listItem.selectedOfferIndex -= 1;
      this.updateOptimisedListWithListItem(listItem).subscribe(result =>
        this.amountSaved = result.savings
      );
    }
  }

  /**
   * Checks whether there exists a next offer for a given list item.
   *
   * @param {OptimisedListItem} listItem The list item to check for.
   * @return {boolean} True if a next offer exists for the list item.
   */
  public existsNextOfferForItem (listItem: OptimisedListItem): boolean {
    return listItem.selectedOfferIndex < listItem.offers.length - 1;
  }

  /**
   * Checks whether there exists a previous offer for a given list item.
   *
   * @param {OptimisedListItem} listItem The list item to check for.
   * @return {boolean} True if a previous offer exists for the list item.
   */
  public existsPreviousOfferForItem (listItem: OptimisedListItem): boolean {
    return listItem.selectedOfferIndex >= 0;
  }

  /**
   * Saves the optimised list and navigates back to the list view.
   */
  public saveOptimisedList () {
    this.optimisationService.saveOptimisedList(this.listUuid).subscribe(_ =>
      this.router.navigate([ '../' ], { relativeTo: this.route })
    );
  }

  /**
   * Updates the optimised list by choosing either a selected offer,
   * or the original list item.
   *
   * @param {OptimisedListItem} listItem The chosen list item to update.
   */
  private updateOptimisedListWithListItem (listItem: OptimisedListItem): Observable<any> {
    const selectedOffer = this.getSelectedOfferForItem(listItem);
    if (selectedOffer) {
      const updatedItem: ListItem = {
        id: listItem.item.id,
        name: selectedOffer.title,
        unit: listItem.item.unit,
        amount: listItem.item.amount,
        onSale: true,
        checked: listItem.item.checked,
      };
      return this.optimisationService.updateOptimisedListWithItem(this.listUuid, updatedItem);
    }
    return this.optimisationService.updateOptimisedListWithItem(this.listUuid, listItem.item);
  }

}
