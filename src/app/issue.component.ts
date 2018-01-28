import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { slideInDownAnimation } from './animations';
import { HService } from './h.service';
import * as _ from 'lodash';

@Component({
    selector: 'issue-comp',
    template: `
        <mat-card>
            <mat-card-title>
                Ways to get values from services (instance <span *ngIf="hService.instanceNumber">{{hService.instanceNumber}}</span>)
            </mat-card-title>
            <mat-card-content>
                <div> naiveGetIp: <span *ngIf="naiveGetIp">{{naiveGetIp}}</span></div>
                <div> lessNaiveGetIp: <span *ngIf="lessNaiveGetIp">{{lessNaiveGetIp}}</span></div>
                <div> somewhatOkGetIp: <span *ngIf="somewhatOkGetIp">{{somewhatOkGetIp}}</span></div>
                <div> betterGetIp: <span *ngIf="betterGetIp">{{betterGetIp}}</span></div>
                <div> verboseGetIp: <span *ngIf="verboseGetIp">{{verboseGetIp}}</span></div>
            </mat-card-content>
        </mat-card>
        <mat-card>
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
    `],
    animations: [slideInDownAnimation],
    // If HService is set to be provided in this issueComponent, we will get 
    // a new instance of HService each time this component is created. 
    // Consequently, if you comment this next line, Angular will look at the clostest top-
    // provided HService which is in the AppModule. This makes the HService behave as a 
    // singleton class (kind of) within the module.
    providers: [HService]
})
export class IssueComponent implements OnInit {
    @HostBinding('@routeAnimation') routeAnimation = true;
    id: string;
    naiveGetIp: string;
    lessNaiveGetIp: string;
    somewhatOkGetIp: string;
    betterGetIp: string;
    verboseGetIp: string;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private hService: HService
    ) {}

    ngOnInit() {
        console.log(this.route.params);
        this.route.params.subscribe((obs: Params) => {
            const x = obs['id'] as string;
            if (x) {
                this.id = x;
            } else {
                this.id = _.uniqueId();
            }
        });
        this.startVariousCalls();
    }

    private async startVariousCalls() {
        await Promise.all([
            this.hService.naiveGetIp().then((v) => { this.naiveGetIp = <string> v; }),
            this.hService.lessNaiveGetIp().then((v) => { this.lessNaiveGetIp = v as string; }),
            this.hService.somewhatOkGetIp().then((v) => { this.somewhatOkGetIp = v as string; }),
            this.hService.betterGetIp().then((v) => { this.betterGetIp = v; }),
            this.hService.verboseGetIp().then((v) => { this.verboseGetIp = v; }),
        ]);
    }
}

//  TODO: Style inputs with https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
