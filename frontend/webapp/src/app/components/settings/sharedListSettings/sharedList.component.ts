import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { List } from '../../../models';
import { ApiService } from '../../../services';
import { FormValidators } from '../../../util';

@Component({
  selector: 'sl-settings',
  templateUrl: './sharedList.template.html',
  styleUrls: [ './sharedList.style.scss' ],
})
export class SharedListsSettingsComponent {

  public shareForm: FormGroup;

  private lists: List[] = [ ];
  private error: string = '';
  private expandedList: List;

  constructor (
    private route: ActivatedRoute,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.apiService.getAllLists().subscribe(lists => {
      this.lists = lists; },
    );
    this.shareForm = this.formBuilder.group({
      mail: [ '', Validators.compose([
        Validators.required,
        FormValidators.validateEmail,
        ]),
      ],
    });
  }
/**
 * method to share a list with a users email
 * @param {string} listId list to be shared
 * @see mail adress of whom to share with resolved from form group
 */
  public shareList (listId: string): void {
    if (this.userExists('TODO')) {
      this.error = '';
      // make api call
    }
    else {
      this.error = 'User ' + 'TODO' + 'could not be found';
    }
  }
  /**
   * method to check if an user to share with exists
   * @return {boolean} true if user was found
   */
 private userExists (mail: string): boolean {
   return true;
 }

 private isExpanded(list: List): boolean {
   return list === this.expandedList;
 }
 private setExpandedList(list: List): void {
   this.expandedList = list;
 }
}
