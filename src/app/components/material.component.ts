import {Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { CHARGE_DE_LAB } from '../definitions/invariants';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html'
})
export class MaterialComponent implements OnInit {

    public spinnerActive: boolean;
    public issues: ISelect[] = [
        {Value: 'FirstVal', ViewValue: 'Need Help'},
        {Value: 'SecondVal', ViewValue: 'Contact Someone'},
        {Value: 'ThirdVal', ViewValue: 'Remind me in a bit'}
    ];
    public sel: ISelect;
    public readonly showSelect: boolean = true;
    private myForm: FormGroup;
    private readonly DEBOUNCE_TIME: number = 500; // ms
    // private myControl: FormControl = new FormControl();
    private autoCompleteOptions: string[] = CHARGE_DE_LAB;
    private filteredOptions: Observable<string[]>;

    public ngOnInit(): void {
        this.spinnerActive = true;

        this.createForm();
        this.trigger();
    }
    public constructor(
                private fb: FormBuilder,
                private snackbar: MatSnackBar
                ) {

    }

    public trigger(): string {
        return 'Will I be returned?';
   }

    public showNotImplemented(): void {
       this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes', {
           duration: 10000
       });
   }

    private createForm(): void {
       this.myForm = this.fb.group({
           name: ['', Validators.required],
           chargeDeLab: ['', Validators.required]
       });
       this.filteredOptions = this.myForm.get('chargeDeLab').valueChanges.pipe(
           startWith(null),
           debounceTime(this.DEBOUNCE_TIME),
           map((name) => this.filterOptions(name))
       );
   }

    private filterOptions(val: string|{}): string[] {
       return val ? this.autoCompleteOptions.filter((s) => new RegExp(`^${val}`, 'gi').test(s)) : this.autoCompleteOptions;
   }
}

interface ISelect {
    Value: string;
    ViewValue: string;
}
