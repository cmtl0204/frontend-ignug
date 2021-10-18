import {AbstractControl, Validators} from '@angular/forms';

export class CustomValidators {
  static required({value}: AbstractControl): boolean {
    console.log(value);
    if (value)
      return value.hasValidator(Validators.required);
    else
      return false;
  }
}
