import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { List } from '../../../models';
import {
  SharingService,
  ApiService,
 } from '../../../services';
import { FormValidators } from '../../../util';

@Component({
  selector: 'sl-settings',
  templateUrl: './sharedList.template.html',
  styleUrls: [ './sharedList.style.scss' ],
})
export class SharedListsSettingsComponent {

  public shareForm: FormGroup;

  private lists: List[] = [ ];
  private sharedWith: string[] = [ ];
  private error: string = '';
  private expandedList: List;

  constructor (
    private route: ActivatedRoute,
    private sharingService: SharingService,
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
    const newUser = this.shareForm.value.mail;
    const alreadyParticipating: boolean = this.sharedWith.findIndex(user =>
      user === newUser) > -1 || newUser === list.owner;

    if (alreadyParticipating) {
        this.error = 'User ' + newUser + ' is already participating';
    } else if (this.shareForm.valid) {
        this.sharingService.addContributor(list.id, newUser).subscribe(
          res => {
           this.error = '';
           this.sharedWith.push(newUser);
           list.shared = true;
          },
         (err) => {
           this.error = 'User ' + newUser + ' could not be found';
         },
       );
    }
  }

  /**
   * remove a contributor from a shared list
   * @param {List} list list to be shared
   * @param {string} user mail adress of the user to be removed
   */
  public removeContributor (list: List, user: string): void {
    this.sharingService.removeContributor(list.id, user).subscribe(_ => {
      const index = this.sharedWith.findIndex(users => users === user);
      this.sharedWith.splice(index, 1);
      if (this.sharedWith.length === 0) {
        list.shared = false;
      }
    });
  }


  /*
   * method called from html template
   */
  private isExpanded (list: List): boolean {
    return list === this.expandedList;
  }

  /**
   * method called from html template
   */
  private setExpandedList (list: List): void {
    this.expandedList = list;
    this.sharedWith = [ ];
    if (! (list === null)) {
      this.sharingService.getContributors(list.id).subscribe(contributors =>
        this.sharedWith = contributors,
      );
    }
  }

  /**
   * method called in the html to hide the email provider
   */
  private trimMail (mail: string): string {
    if (mail == null) {
      return 'yourself';
    } else {
      return mail.substring(0, mail.indexOf('@')).replace('.', ' ');
    }
  }
}
