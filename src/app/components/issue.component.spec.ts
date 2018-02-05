import { TestBed, async as angularAsync, ComponentFixture } from '@angular/core/testing';
import { IssueComponent } from './issue.component';
import { DebugElement } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HService, ipMethods } from '../services/h.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from '../testing/router-stubs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from '../my-material.module';
import { By } from '@angular/platform-browser';

class RouterStub {
    navigateByUrl(url: string) { return url; }
}

// A class that replaces the traditionnal HService
// The only thing necessary is that HServiceSpy contains the methods
// that will be called in the Component under test. (see how the 'unrelated method' in
// the original service is not declared here, nor dynamically created).
class HServiceSpy {
    instanceNumber: number;
    // Create a value that was non existant in the original HService.
    public readonly otherValue: string = 'I am a stub';
    // We dynamically attach the methods by getting the name of the functions in the
    // first parameter
    constructor(ipMethodsName: string[], valueToResolve: any, instanceNumber: number = 0) {
        this.instanceNumber = instanceNumber;
        for (const method of ipMethodsName) {
            // Note that this method will not be executed if we spy on the service
            // as we do later.
            this[method] = (): Promise<any> => {
                console.log('Response from spy service');
                return Promise.resolve(valueToResolve);
            };
        }
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

    // IP that the HServiceSpy will answer
    const serviceAnswerIp = ':::1';
    // IP that the spy on the injected service will use.
    const spyValueIp = ':::2';

    // This will only be ran once
    beforeAll(() => {
        hServiceIpSpies = new Map<string, jasmine.Spy>();
        hsSpy = new HServiceSpy(ipMethods, serviceAnswerIp);
        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParamMap = { id: 'pas important' };
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
            declarations: [IssueComponent],
            providers: [
                { provide: HService, useValue: hsSpy },
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useValue: activatedRoute },
            ],
            schemas: [
                // If the current component only uses elements (aka <> in HTML) that ARE IMPORTED
                // by the testing module, this line is not necessary
                //    CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
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
            const spy = spyOn(hService, iterator).and.returnValue(Promise.resolve(spyValueIp));
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

    it('should get the ip from either spy', angularAsync(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const firstVal = debugElement.query(By.css('#httplist span.value'));
            const nativeSpan = firstVal.nativeElement as HTMLSpanElement;
            // Check if the value is either serviceAnswerIp or spyValueIp
            expect([serviceAnswerIp, spyValueIp]).toContain(nativeSpan.textContent);
        });
    }));

});
