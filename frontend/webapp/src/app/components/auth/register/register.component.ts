import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

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
      ]) ],
    });
  }

  /**
   * Form submission handler
   */
  public onSubmit (data: { email: string, password: string, passwordConfirmation: string }) {
    if (this.form.valid) {
      this.authService.register(data);
    }
  }

}
