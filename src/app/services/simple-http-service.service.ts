import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SimpleHttpServiceService {
  public readonly API_URL: string = 'http://httpbin.org';
  public constructor(private httpc: HttpClient) { }

  public async GetSimpleIp(): Promise<string> {
    return this.httpc.get(this.API_URL + '/ip').toPromise().then((v) => v.toString());
  }

  public async GetIpPromise(): Promise<Object> {
    // console.log('GetipPromise called');

    return this.httpc.get(this.API_URL + '/random').pipe(
      catchError(async (err) => Promise.reject(err))
    ).toPromise();
  }

  public async GetSureIp(): Promise<string> {
    return Promise.resolve(':::1');
  }
}
