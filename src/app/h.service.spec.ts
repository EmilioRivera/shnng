import { HService } from './h.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject, getTestBed } from '@angular/core/testing';

describe('A basic http service', () => {

    let theService: HService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HService],
            imports: [HttpClientTestingModule]
        });
        const injector = getTestBed();
        theService = injector.get(HService);
        httpMock = injector.get(HttpTestingController);
    });

    it('should be created', inject([HService], (service: HService) => {
        expect(service).toBeTruthy();
    }));

    it('should get an ip ', () => {
        theService.betterGetIp().then((v) => {
            console.log(v);
            expect(v).toBeTruthy();
        });
        const req = httpMock.expectOne(`http://httpbin.org/ip`);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
