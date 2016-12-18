import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { List } from '../../models';
import { ApiService } from '../../services';

@Component({
  selector: 'sl-list-overview',
  templateUrl: './list-overview.template.html',
  styleUrls: [ './list-overview.style.scss' ],
})
export class ListOverviewComponent implements OnInit {

  public MAX_NAME_LENGTH: number = 32;

  /** Available lists */
  public lists: List[] = [ ];

  public form: FormGroup;

  constructor (
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {
    this.form = this.formBuilder.group({
      listName: [ '', Validators.compose([
        Validators.required,
        Validators.maxLength(this.MAX_NAME_LENGTH),
      ]) ],
    });
  }

  /**
   * @memberOf OnInit
   */
  public ngOnInit (): void {
    this.route.data.subscribe((data: { lists: List[] }) => this.lists = data.lists);
  }

  /**
   * Adds a list, updates the List Array when API call is successful
   *
   * @return {void}
   */
  public addList (event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.apiService.createList(this.form.value.listName)
        .subscribe((res: { id: string}) => this.lists.push({
          name: this.form.value.listName,
          id: res.id,
          count: 0,
          items: [ ],
        }));
    }
  }
}
