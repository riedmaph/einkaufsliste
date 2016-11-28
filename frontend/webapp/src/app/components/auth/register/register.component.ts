import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { FormValidators } from '../../../util';
import { AuthService } from '../../../services';

const MIN_PASSWORD_LENGTH = 7;
const MAX_PASSWORD_LENGTH = 53;

@Component({
  selector: 'sl-register',
  templateUrl: './register.template.html',
})
export class RegisterComponent {

  public form: FormGroup = null;

  public globalErrors: { message: string }[] = [ ];

  constructor (
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      'email': [ '', Validators.compose([
        Validators.required,
        FormValidators.validateEmail,
      ]) ],
      'password': [ '', Validators.compose([
        Validators.required,
        Validators.minLength(MIN_PASSWORD_LENGTH),
        Validators.maxLength(MAX_PASSWORD_LENGTH),
      ]) ],
      'passwordConfirmation': [ '', Validators.compose([
        Validators.required,
        // @TODO Equal to password
      ]) ],
    });
  }

  /**
   * Form submission handler.
   * Navigates to home with ?registerSuccess=true on succes @TODO
   * Shows error on failure.
   *
   * @param {{ email: string, password: string, passwordConfirmation: string }} data Form data
   * @return {void}
   */
  public onSubmit (data: { email: string, password: string, passwordConfirmation: string }): void {
    if (this.form.valid) {
      this.authService.register(data).subscribe(res => {
        this.router.navigate([ '' ], { queryParams: { registerSuccess: true } });
      }, (res: Response) => {
        let body = res.json();
        if (res.status === 400) {
          this.globalErrors.push({
            message: 'An error occured. Please make sure all fields are filled out correctly.',
          });
          if (ENV === 'development') {
            console.error(body.message);
          }
        } else if (res.status === 500) {
          this.globalErrors.push({
            message: 'An error occured. Please try again at a later time.',
          });
          if (ENV === 'development') {
            console.error(body.message);
          }
        }
      });
    } else {
      this.globalErrors.push({
        message: 'An error occured. Please make sure all fields are filled out correctly.',
      });
    }
  }

}