import { Component } from '@angular/core';

@Component({
  selector: 'sl-settings-overview',
  templateUrl: './overview.template.html',
  styleUrls: [ './overview.style.scss' ],
})
export class SettingsOverviewComponent {

  private showFavMarketDetails: Boolean = false;
  private showSharedListsDetails: Boolean = false;

  /** Toggle whether fav market details are shown */
  public toggleFavMarketsDetails (): void {
    this.showFavMarketDetails = !this.showFavMarketDetails;
  }

  /** Toggle whether shared list details are shown */
  public toggleSharedListDetails (): void {
    this.showSharedListsDetails = !this.showSharedListsDetails;
  }
}
