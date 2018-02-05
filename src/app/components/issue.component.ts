import { animate, group, state, style, transition, trigger, query } from '@angular/animations';
import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { slideInDownAnimation } from '../definitions/animations';
import { HService, ipMethods, ipDescriptors } from '../services/h.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-issue',
    templateUrl: './issue.component.html',
    styleUrls: [ './issue.component.css' ],
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
