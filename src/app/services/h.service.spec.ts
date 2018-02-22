import { HService } from './h.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { logPromiseError } from '../testing/log-error';

describe('A basic http service', () => {

    let theService: HService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HService]
        });

        theService = TestBed.get(HService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get a value from ip', () => {
        theService.lessNaiveGetIp().then((v) => {
            expect(v).toEqual('anything');
        }).catch(logPromiseError);

        const req: TestRequest = httpMock.expectOne(theService.API_URL_IP);
        req.flush({'origin': 'anything'});
    });

});
