import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SimpleHttpServiceService {
  public readonly API_URL = 'http://httpbin.org';
  constructor(private httpc: HttpClient) { }

  public GetSimpleIp(): Promise<string> {
    return this.httpc.get(this.API_URL + '/ip').toPromise().then(v => v.toString());
  }

  public GetIpPromise(): Promise<Object> {
    console.log('GetipPromise called');
    return this.httpc.get(this.API_URL + '/random').pipe(
      catchError((err) => Promise.reject(err))
    ).toPromise();
  }

  public GetSureIp(): Promise<string> {
    return Promise.resolve(':::1');
  }
}
