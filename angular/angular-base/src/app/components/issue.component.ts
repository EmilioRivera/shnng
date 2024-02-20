import { animate, group, style, transition, trigger, query } from '@angular/animations';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HService, ipMethods, ipDescriptors } from '../services/h.service';
import { MatIconRegistry, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { FileUploaderService, IProgress } from '../services/file-uploader.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { throttleTime, auditTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css'],
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
  public fileProgress: BehaviorSubject<IFileUpload[]>;
  public displayedColumns: string[] = ['name', 'size', 'progress'];
  public uploadTracker: Subscription[];

  public constructor(
    // tslint:disable-next-line:no-unused-variable
    private route: ActivatedRoute,
    // tslint:disable-next-line:no-unused-variable
    private router: Router,
    private hService: HService,
    private fileUploader: FileUploaderService
  ) {}

  public ngOnInit(): void {
    // console.log(this.route.params);
    this.id = this.hService.instanceNumber.toString();
    void this.startVariousCalls();
    void this.getValueViaDescriptor();
    this.fileProgress = new BehaviorSubject<IFileUpload[]>([]);
  }

  public fileSelection(e: Event): void {
    console.log(e);
    const targetElement: HTMLInputElement =  e.target as HTMLInputElement;
    const files: FileList = targetElement.files;
    this.joinFilesToUpload(files);
  }

  public obtainValues(p: any): void {
    console.log(p);
  }

  public uploadAllFiles(): void {
    const activatedFiles: IFileUpload[] = this.fileProgress.value.map((file: IFileUpload) => {
      file.active = true;

      return file;
    });
    this.fileProgress.next(activatedFiles);
    let o = this.fileUploader.multiSingleUpload(activatedFiles.map((v) => v.file));
    this.uploadTracker = o.map((obs, i) => {
      return obs.subscribe(
        ((val) => {
          if (val === undefined) {
            return;
          }
          this.fileProgress.value[i].progress = val.progress;
        }),
        ((err) => {
          console.error(err);
          this.fileProgress.value[i].progress = 0;
          this.fileProgress.value[i].active = false;
        }),
        (() => {
          this.fileProgress.value[i].progress = 1;
          this.fileProgress.value[i].active = false;
        })
      );
    });
    // this.fileUploader.upload(activatedFiles.map((v) => v.file)).pipe(
    //   distinctUntilChanged((x: IProgress, y: IProgress): boolean => {
    //     // tslint:disable-next-line:no-magic-numbers
    //     if (x === undefined || y === undefined) {
    //       return true;
    //     }

    //     return y.progress === 1 || (x.which === y.which && x.progress - y.progress > 0.1);
    //   })
    // ).subscribe(
    //   (obs: IProgress) => {
    //     console.log(`Component got ${obs.which} : ${obs.progress}`);
    //     let x = this.fileProgress.value;
    //     x[obs.which].progress = obs.progress;
    //   },
    //   (err) => { console.error(err); },
    //   () => {
    //     console.log('All done!');
    //   }
    // );
  }
  public anyActive = (): boolean => this.fileProgress.getValue().filter((v) => v.active).length === 0;
  public cancelActive(): void {
    console.log('Theres some active');
    const active: number[] = this.fileProgress.value.reduce((idxArray: number[], val, currentIndex) => {
      if (val.active) {
        idxArray.push(currentIndex);
      }

      return idxArray;
    },                                                      []);
    console.log(active);
    active.forEach((i) => {
      console.log(`Cancelling ${this.fileProgress.value[i].file.name}`);
      this.uploadTracker[i].unsubscribe();
    });
  }
  public removeAllFiles(): void {
    // We should check if we're currently uploading stuff so we can
    // cancel it... but that's for later
    this.fileProgress.next([]);
  }

  // Implement a strategy to merge files
  private joinFilesToUpload(files: FileList): void {
    // For the moment this is as simple as adding eveything
    // we get, but we have to check for duplicates and/or
    // supported files with constraints.
    const filesToUp: IFileUpload[] = [];
    const currentSel: IFileUpload[] = this.fileProgress.getValue();
    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < files.length; i++) {
      filesToUp.push({
        'file': files[i],
        'progress': 0,
        active: false
      });
    }
    const finalSelection: IFileUpload[] = this.removeDuplicates(currentSel, filesToUp);
    this.fileProgress.next(finalSelection);
  }

  private removeDuplicates(currentSel: IFileUpload[], toAdd: IFileUpload[]): IFileUpload[] {
    // Note that the order is important in the _.concat
    // (We get the newest by the same name)
    return _.uniqBy(_.concat(toAdd, currentSel), 'file.name');
  }

  private async startVariousCalls(): Promise<void> {
    await Promise.all(
      // Create an array of Promises from the function names
      ipMethods.map(async (key: string) => {
        // Call the function of hService. We know they all
        // are Promise-returning function so we can use await
        const retVal: string = await this.hService[key]();
        // Add an intentional random delay to simulate real http requests
        await new Promise((resolve) => setTimeout(resolve, _.random(this.MAX_WAIT_TIME, true)));
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

interface IFileUpload {
  file: File;
  progress: number;
  active?: boolean;
}
