import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { List } from '../../../models';
import { ApiService } from '../../../services';

@Component({
  selector: 'sl-settings',
  templateUrl: './sharedList.template.html',
  styleUrls: [ './sharedList.style.scss' ],
})
export class SharedListsSettingsComponent {
  private lists: List[] = [ ];
  private error: string = '';

  constructor (
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.apiService.getAllLists().subscribe(lists => {
      this.lists = lists; },
    );
  }
/**
 * method to share a list with a users email
 * @param {string} ListId list to be shared
 * @param {string} mail mail of the user to share with
 */
  public shareList (ListId: string, mail: string): void {
    if (this.userExists(mail)) {
      this.error = '';
      // make api call
    }
    else {
      this.error = 'User ' + mail + 'could not be found';
    }
  }
  /**
   * method to check if an user to share with exists
   * @return {boolean} true if user was found
   */
 private userExists (mail: string): boolean {
   return true;
 }
}
