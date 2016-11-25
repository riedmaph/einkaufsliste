import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Response } from '@angular/http';

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

  constructor (
    private formBuilder: FormBuilder,
    private authService: AuthService,
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
   * Form submission handler
   */
  public onSubmit (data: { email: string, password: string, passwordConfirmation: string }) {
    if (this.form.valid) {
      this.authService.register(data).subscribe(res => {
        // Success
        console.info('Registration successful');
      }, (res: Response) => {
        let body = res.json();
        if (res.status === 400) {
          // Bad Request, i.e. validation error
          console.error(body.message);
        } else if (res.status === 500) {
          // Internal Server Error
          console.error(body.message);
        }
      });
    }
  }

}
