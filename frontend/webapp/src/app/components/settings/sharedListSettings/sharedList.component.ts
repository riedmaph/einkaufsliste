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
 * method to share a list with a user
 * @param {List} list list to be shared
 * @see mail adress of whom to share with resolved from form group
 */
  public shareList (list: List): void {
    const user = this.shareForm.value;
    if (this.shareForm.valid) {
      if (this.userExists(user)) {
        this.error = '';
       /* this.apiService.addContributor(list.id, user).subscribe(_ => 
          list.sharedWith.push(user)
        );*/
      }
      else {
        this.error = 'User ' + this.shareForm.value + 'could not be found';
      }
    }
  }

/**
 * remove a contributor from a shared list
 * @param {List} list list to be shared
 * @param {string} user mail adress of the user to be removed
 */
  public removeContributor (list: List, user: string): void {
  /* this.apiService.removeContributor(list.id, user).subscribe(_ => {
      const index = list.sharedWith.findIndex(users => user === user);
      list.sharedWith.splice(index, 1); });
    */
  }


  /**
   * method to check if an user to share with exists
   * @return {boolean} true if user was found
   */
 private userExists (mail: string): boolean {
   // @TODO make api call
   return true;
 }

 private isExpanded(list: List): boolean {
   return list === this.expandedList;
 }
 private setExpandedList(list: List): void {
   this.expandedList = list;
 }
}
