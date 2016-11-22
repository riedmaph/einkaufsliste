import { FormControl } from '@angular/forms';

export class FormValidators {

  /**
   * Validations whether the value entered in a FormControl is a valid email address
   *
   * @param {FormControl} formControl FormControl to validate
   * @return {Object} null when valid, { invalidEmail: true } when invalid
   */
  public static validateEmail (formControl: FormControl) {
    /* tslint:disable:max-line-length */
    let regex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
    /* tslint:enable */
    return regex.test(formControl.value) ? null : {
      invalidEmail: true,
    };
  }

}
