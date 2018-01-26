import {Component, OnInit, HostBinding} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, NgModel, Validators, FormControl } from '@angular/forms';
import {Operator, Observable} from 'rxjs/Rx';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { CHARGE_DE_LAB } from './definitions';
import * as _ from 'lodash';

@Component({
    selector: 'my-mat',
    template: `
        <div>
            <mat-card>
                <label for="displaceX">Displacement X</label>
                <mat-form-field>
                 <input matInput type="number" step="10"/>
                </mat-form-field>
                <button mat-button color="primary" type="button">Enter</button>
            </mat-card>

            <mat-card>
                <label for="displaceY">Displacement Y</label>
                <mat-form-field>
                    <input matInput ink="All" type="number" step="10"/>
                </mat-form-field>
                <button type="button" mat-button color="primary">Enter</button>
            </mat-card>

            <mat-card>
                Scale
                <mat-slider step="2" min="0" max="200" tick-interval="10" thumb-label>
                </mat-slider>
                <button mat-button color="secondary">Apply</button>
            </mat-card>

            <mat-form-field>
                <input matInput ink="All" placeholder="Enter string"/>
            </mat-form-field>

            <mat-card>
                <button mat-button color="primary"
                        matTooltip="I dare you to click me">
                Teapot Madness
                </button>
            </mat-card>
        </div>
        <mat-card>
            <mat-card-content>
                <h2 class="example-h2">Result</h2>

                <mat-progress-spinner *ngIf="spinnerActive"
                    class="example-margin"
                    color="warn"
                    mode="indeterminate"
                    >
                </mat-progress-spinner>
                <mat-progress-bar
                    class="example-margin"
                    color="accent"
                    mode="query"
                    >
                </mat-progress-bar>
            </mat-card-content>
        </mat-card>
        <mat-card>
            <mat-select placeholder="Issue Type" *ngIf="showSelect" [(ngModel)]="sel">
                <mat-option>None</mat-option>
                <mat-option *ngFor="let ii of issues" [value]="ii.Value">{{ii.ViewValue}}</mat-option>
            </mat-select>
            <span>{{sel}}</span>
        </mat-card>

        <mat-toolbar color="accent" style="margin-top: 1em;">
            <span>Form Below</span>
        </mat-toolbar>
        <mat-card>
            <mat-card-title>Form example</mat-card-title>
            <mat-card-subtitle>Example of autocomplete and validation</mat-card-subtitle>
            <img mat-card-image src="https://unsplash.it/1920/1080/?gravity=east" />
            <mat-card-content>
                <form [formGroup]="myForm" novalidate>
                    <mat-form-field>
                        <input matInput formControlName="name">
                    </mat-form-field>

                    <mat-form-field>
                        <input type="text" matInput formControlName="chargeDeLab" [matAutocomplete]="auto">
                        <mat-autocomplete #auto="matAutocomplete">
                            <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
                                {{ option }}
                            </mat-option>
                        </mat-autocomplete>
                    </mat-form-field>

                </form>
                <p>Form value: {{ myForm.value | json }}</p>
                <p>Form status: {{ myForm.status | json }}</p>
                <p> Pipe status: {{myForm | formStatus: 'name' | json}} </p>
                <p> Pipe status: {{myForm | formStatus: 'chargeDeLab' | json}} </p>
            </mat-card-content>
        </mat-card>
    `,
})
export class MaterialComponent implements OnInit {

    spinnerActive: boolean;
    issues: ISelect[] = [
        {Value: 'FirstVal', ViewValue: 'Need Help'},
        {Value: 'SecondVal', ViewValue: 'Contact Someone'},
        {Value: 'ThirdVal', ViewValue: 'Remind me in a bit'}
    ];
    sel: ISelect;
    readonly showSelect = true;
    myForm: FormGroup;
    myControl = new FormControl();
    autoCompleteOptions = CHARGE_DE_LAB;
    filteredOptions:  Observable<string[]>;

    ngOnInit(): void {
        this.spinnerActive = true;

        this.createForm();
        console.log(this.trigger());
    }
    constructor(
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
       console.log(this.myForm);
       this.filteredOptions = this.myForm.get('chargeDeLab').valueChanges.pipe(
           startWith(null),
           debounceTime(500),
           map(name => this.filterOptions(name))
       );
   }

   private filterOptions(val: string|{}) {
       return val ? this.autoCompleteOptions.filter(s => new RegExp(`^${val}`, 'gi').test(s)) : this.autoCompleteOptions;
   }
}

interface ISelect {
    Value: string;
    ViewValue: string;
}
