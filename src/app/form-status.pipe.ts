import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/*
 * Show a FormControl status (warning: this is an Impure Pipe)
 * Takes a string that is the desired FormControl name
 * Usage:
 *   formGroup | formStatus: 'nameOfControl'
 * Example:
 *   {{ myFormGroup |  formStatus: 'quantity'}}
*/
@Pipe({ name: 'formStatus', pure: false})
export class FormStatusPipe implements PipeTransform {
    transform(formGroup: FormGroup, name: string): Object {
        const re = formGroup.get(name);
        return re == null ? {} : {
            controlName: name,
            controlValue: re.value,
            controlStatus: re.status,
            controlPristine: re.pristine,
            controlUntouched: re.untouched
        };
    }
}
