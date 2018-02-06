import { TestBed, inject, getTestBed, async as angularAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SimpleHttpServiceService } from './simple-http-service.service';
import { TestRequest } from '@angular/common/http/testing/src/request';
import { logPromiseError } from '../testing/log-error';

describe('SimpleHttpServiceService', () => {
  let backend: HttpTestingController;
  let service: SimpleHttpServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SimpleHttpServiceService]
    });
    backend = getTestBed().get(HttpTestingController);
    service = getTestBed().get(SimpleHttpServiceService);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ask approriate url for getting even when using custom http client', inject([HttpClient], (http: HttpClient) => {
    http.get('http://httpbin.org/ip').toPromise().then((val) => {
      // console.log(val);
      expect(val).toBe('192.168.1.21');
    }).catch(logPromiseError);
    const r: TestRequest = backend.expectOne('http://httpbin.org/ip');
    r.flush('192.168.1.21');
  }));

  it('should get a value from the service', () => {
    service.GetSimpleIp().then((value) => {
      // console.log(value);
      expect(value).toBe(':::1');
    }).catch(logPromiseError);

    const request: TestRequest = backend.expectOne(service.API_URL + '/ip');
    request.flush(':::1');
  });
});

// Instead of using the prior initialization, we inject the services
// for each function that needs it. More verbose, but just for proof
// of concept.
describe('A related test suite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [SimpleHttpServiceService]
    });
  });

  // tslint:disable-next-line:max-line-length
  it('should always pass on non http promises', angularAsync(inject([SimpleHttpServiceService], (object: SimpleHttpServiceService) => {
    object.GetSureIp().then((val) => {
      expect(val).toBeTruthy();
    }).catch((reason) => {
      fail('This should be impossible since the promise is resolved....');
    });
  })));

  // tslint:disable-next-line:max-line-length
  it('should be able to answer if backend is injected directly', angularAsync(inject([SimpleHttpServiceService, HttpTestingController], (object: SimpleHttpServiceService, backend: HttpTestingController) => {
    const expectedIp: string = ':::1';
    object.GetSimpleIp().then((v) => {
      expect(v).toBe(expectedIp);
    }).catch(logPromiseError);
    const request: TestRequest = backend.expectOne(object.API_URL + '/ip');
    request.flush(expectedIp);
  })));
});
