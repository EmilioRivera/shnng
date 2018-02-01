import { animate, group, state, style, transition, trigger, query } from '@angular/animations';
import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { slideInDownAnimation } from './animations';
import { HService, ipMethods, ipDescriptors } from './h.service';
import * as _ from 'lodash';

@Component({
    selector: 'issue-comp',
    template: `
        <mat-card>
            <mat-card-title>
                Ways to get values from services (instance <span *ngIf="hService.instanceNumber">{{hService.instanceNumber}}</span>)
            </mat-card-title>
            <mat-card-content>
                <span mat-subheader>Ways of using http calls</span>
                <mat-list id="httplist">
                    <mat-list-item *ngFor="let v of ipMethods; last as last">
                        <span class="name">{{v}}:</span>
                        <span class="value" *ngIf="methodsOfCalling[v]">{{methodsOfCalling[v]}}</span>
                        <mat-divider [inset]="false" *ngIf="!last"></mat-divider>
                    </mat-list-item>
                </mat-list>
                <label for="file">Chooze deh file</label>
                <input type="file" name="file" id="file" class="inputfile" />
            </mat-card-content>
        </mat-card>
        <mat-card >
            <h3>Upload Queue</h3>
            <table>
                <thead>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </mat-card>

        <mat-card>
            <mat-card-subtitle>Queue progress</mat-card-subtitle>
            <mat-progress-bar
                color="accent"
                mode="determinate"
            ></mat-progress-bar>

            <button mat-button color="primary"
                    mat-tooltip="Upload all items">
                    Upload All
            </button>

            <button mat-button color="accent"
                    mat-tooltip="Cancel all items">
                    Cancel All
            </button>

            <button mat-button color="warn"
                    mat-tooltip="Remove All items">
                    Remove all
            </button>
        </mat-card>

    `,
    styles: [`

        mat-card-title{
            font-family: Khula;
            font-size: 5em;
            text-align: center;
        }

        mat-card{
            margin-bottom: 4px;
        }

        .my-drop-zone{
            outline: solid 1px aliceblue;
            padding: 2em;
            border-radius: 3em;
            display: inline-block;
        }

        .inputfile {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }

        #httplist mat-list-item span.name{
            flex-grow: 1;
        }

    `],
    animations: [
        trigger('routeAnimation', [
          transition(':increment', group([
            query(':enter', [
              style({
                left: '100%'
              }),
              animate('0.5s ease-out', style('*'))
            ]),
            query(':leave', [
              animate('0.5s ease-out', style({
                left: '-100%'
              }))
            ])
          ])),
          transition(':decrement', group([
            query(':enter', [
              style({
                left: '-100%'
              }),
              animate('0.5s ease-out', style('*'))
            ]),
            query(':leave', [
              animate('0.5s ease-out', style({
                left: '100%'
              }))
            ])
          ]))
        ])
      ],
    // If HService is set to be provided in this issueComponent, we will get
    // a new instance of HService each time this component is created.
    // Consequently, if you comment this next line, Angular will look at the clostest top-
    // provided HService which is in the AppModule. This makes the HService behave as a
    // singleton class (kind of) within the module.
    // providers: [HService]
})
export class IssueComponent implements OnInit {
    @HostBinding('@routeAnimation') routeAnimation = true;
    id: string;

    // Create a map (ipMethod) => result
    methodsOfCalling = _.reduce(ipMethods, (obj, key: string) => {
        obj[key] = 'Working on it...';
        return obj;
    }, {});

    // First descriptor containing the method of ips
    // Which is an alternative way of using metadata
    reflectionMethodOfCalling = ipDescriptors[0];

    // Copy of imported that get our ip
    public readonly ipMethods = ipMethods;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private hService: HService
    ) {}

    ngOnInit() {
        console.log(this.route.params);
        this.id = this.hService.instanceNumber.toString();
        this.startVariousCalls();
    }

    private async startVariousCalls() {
        await Promise.all(
            // Create an array of Promises from the function names
            ipMethods.map(async (key: string) => {
                // Call the function of hService. We know they all
                // are Promise-returning function so we can use await
                const retVal = await this.hService[key]();
                // Add an intentional random delay to simulate real http requests
                await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));
                // Store the values in our array that is templated in HTML
                this.methodsOfCalling[key] = retVal;
                // Don't forget to return the Promise so the top-level await works
                return retVal;
        }));
    }

    private async getValueViaDescriptor(): Promise<any> {
        console.log('Invoking via descriptor: ');
        // We can use a descriptor to invoke the method said descriptor holds (in its 'value')
        // With this descriptor, we could use any HService, but we use our own copy.
        const valueViaDescriptor = await (<Function>this.reflectionMethodOfCalling.value).call(this.hService, null);
        console.log(valueViaDescriptor);
        return valueViaDescriptor;
    }
}

//  TODO: Style inputs with https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
