import { animate, group, style, transition, trigger, query } from '@angular/animations';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    @HostBinding('@routeAnimation') public routeAnimation: Boolean = true;
    public id: string;
    private readonly MAX_WAIT_TIME: number = 3000; // ms
    // Create a map (ipMethod) => result
    public methodsOfCalling: {} = _.reduce(ipMethods, (obj, key: string) => {
        obj[key] = 'Working on it...';

        return obj;
    },                                     {});

    // First descriptor containing the method of ips
    // Which is an alternative way of using metadata
    public reflectionMethodOfCalling: TypedPropertyDescriptor<any> = ipDescriptors[0];

    // Copy of imported that get our ip
    public readonly ipMethods: (string|symbol)[] = ipMethods;

    public constructor(
        // tslint:disable-next-line:no-unused-variable
        private route: ActivatedRoute,
        // tslint:disable-next-line:no-unused-variable
        private router: Router,
        private hService: HService
    ) {}

    public ngOnInit(): void {
        // console.log(this.route.params);
        this.id = this.hService.instanceNumber.toString();
        void this.startVariousCalls();
        void this.getValueViaDescriptor();
    }

    public fileSelection(): void {
      // tslint:disable-next-line:no-trailing-whitespace
      
    }

    public obtainValues(p: any): void {
      console.log(p);
    }

    private async startVariousCalls(): Promise<void> {
        await Promise.all(
            // Create an array of Promises from the function names
            ipMethods.map(async (key: string) => {
                // Call the function of hService. We know they all
                // are Promise-returning function so we can use await
                const retVal: string = await this.hService[key]();
                // Add an intentional random delay to simulate real http requests
                await new Promise((resolve) => setTimeout(resolve, Math.random() * this.MAX_WAIT_TIME));
                // Store the values in our array that is templated in HTML
                this.methodsOfCalling[key] = retVal;
                // Don't forget to return the Promise so the top-level await works

                return retVal;
        }));
    }

    private async getValueViaDescriptor(): Promise<string> {
        // We can use a descriptor to invoke the method said descriptor holds (in its 'value')
        // With this descriptor, we could use any HService, but we use our own copy.
        // tslint:disable-next-line:no-unnecessary-local-variable
        const valueViaDescriptor: string = await (this.reflectionMethodOfCalling.value as Function).call(this.hService, null);
        // console.log(valueViaDescriptor);

        return valueViaDescriptor;
    }
}
