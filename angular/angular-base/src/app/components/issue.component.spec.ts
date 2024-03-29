import { TestBed, async as angularAsync, ComponentFixture } from '@angular/core/testing';
import { IssueComponent } from './issue.component';
import { DebugElement } from '@angular/core';
import { HService, ipMethods } from '../services/h.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from '../testing/router-stubs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from '../my-material.module';
import { By } from '@angular/platform-browser';
import { logPromiseError } from '../testing/log-error';
import { Observable } from 'rxjs/Observable';
import { of as oof } from 'rxjs/observable/of';
import { FileUploaderService } from '../services/file-uploader.service';
import { FileSizePipe } from '../pipes/file-size.pipe';

class RouterStub {
    public navigateByUrl(url: string): string { return url; }
}

// A class that replaces the traditionnal HService
// The only thing necessary is that HServiceSpy contains the methods
// that will be called in the Component under test. (see how the 'unrelated method' in
// the original service is not declared here, nor dynamically created).
class HServiceSpy {
    public instanceNumber: number;
    // Create a value that was non existant in the original HService.
    public readonly otherValue: string = 'I am a stub';
    // We dynamically attach the methods by getting the name of the functions in the
    // first parameter
    public constructor(ipMethodsName: (string|symbol)[], valueToResolve: any, instanceNumber: number = 0) {
        this.instanceNumber = instanceNumber;
        for (const method of ipMethodsName) {
            // Note that this method will not be executed if we spy on the service
            // as we do later.
            this[method] = async (): Promise<any> => {

                return Promise.resolve(valueToResolve);
            };
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
class UploadSpyService {
    public upload(files: File[]): Observable<any> {
        return oof([{
            'exampleData': 'hi'
        }]);
    }
}

describe('IssueComponent', () => {
    let fixture: ComponentFixture<IssueComponent>;
    let debugElement: DebugElement;
    let issueInstance: any;
    let hService: HService;
    let hServiceIpSpies: Map<string, jasmine.Spy>;
    let activatedRoute: ActivatedRouteStub;
    let hsSpy: HServiceSpy;
    let upSpy: UploadSpyService;

    // IP that the HServiceSpy will answer
    const serviceAnswerIp: string = ':::1';
    // IP that the spy on the injected service will use.
    const spyValueIp: string = ':::2';

    // This will only be ran once
    beforeAll(() => {
        hServiceIpSpies = new Map<string, jasmine.Spy>();
        hsSpy = new HServiceSpy(ipMethods, serviceAnswerIp);
        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParamMap = { id: 'pas important' };
        upSpy = new UploadSpyService();
    });

    beforeEach(angularAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                // Even if animations are broken in our case, the dependency is still there
                // so we use a 'trivial' animations module.
                NoopAnimationsModule,
                // Note that importing Material module is not necessary for testing:
                // Including will make the CUSTOM_ELEMENTS_SCHEMA useless,
                // and will render the component somewhat correctly.
                MyMaterialModule
            ],
            declarations: [IssueComponent, FileSizePipe],
            providers: [
                { provide: HService, useValue: hsSpy },
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: FileUploaderService, useValue: upSpy },
            ],
            schemas: [
                // If the current component only uses elements (aka <> in HTML) that ARE IMPORTED
                // by the testing module, this line is not necessary
                //    CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents().catch(logPromiseError);
    }));

    beforeEach(angularAsync(() => {
        fixture = TestBed.createComponent(IssueComponent);
        debugElement = fixture.debugElement;
        issueInstance = debugElement.componentInstance;
        // Get the HService by injector.
        // Note that the result will be the object provided in useValue
        // which will actually be a spy (HServiceSpy).
        hService = debugElement.injector.get(HService);
    }));

    beforeEach(() => {
        // We can further customize the value which will NOT call the service
        for (const iterator of ipMethods) {
            const spy: jasmine.Spy = spyOn(hService, iterator as any).and.returnValue(Promise.resolve(spyValueIp));
            hServiceIpSpies[iterator] = spy;
        }
        // If you want to see which service is used, you can uncomment these:
        // console.log(hServiceIpSpies);
        // console.log(hService);
    });

    afterEach(() => {
        hServiceIpSpies.clear();
    });

    it('should be created', () => {
        expect(issueInstance).toBeTruthy();
    });

    it('should get the ip from either spy', () => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const firstVal: DebugElement = debugElement.query(By.css('#httplist span.value'));
            const nativeSpan: HTMLSpanElement = firstVal.nativeElement as HTMLSpanElement;
            // Check if the value is either serviceAnswerIp or spyValueIp
            expect([serviceAnswerIp, spyValueIp]).toContain(nativeSpan.textContent);
        }).catch(logPromiseError);
    });

});
