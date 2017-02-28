import { Component } from '@angular/core';

@Component({
  selector: 'sl-settings-overview',
  templateUrl: './overview.template.html',
  styleUrls: [ './overview.style.scss' ],
})
export class SettingsOverviewComponent {

  private showFavMarketDetails: Boolean = false;
  private showSharedListsDetails: Boolean = false;


/**
 * methods called in the html
 */
  private toggleFavMarketsDetails (): void {
    this.showFavMarketDetails = !this.showFavMarketDetails;
  }
  private toggleSharedListDetails (): void {
    this.showSharedListsDetails = !this.showSharedListsDetails;
  }
}
