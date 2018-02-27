import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SERVER_URL } from '../definitions/invariants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of as oof } from 'rxjs/observable/of';

@Injectable()
export class FileUploaderService {

  public constructor(private httpClient: HttpClient) { }

  public upload(files: File[]): Observable<any> {
    if (this.upload.length > 1) {
      return Observable.throw('Not supported multiple file upload');
    }
    const requestHeaders: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json'
    });
    const formData: FormData = new FormData();
    formData.append('upload', files[0], files[0].name);

    return this.httpClient.post(SERVER_URL + '/upload', formData, {
      headers: requestHeaders,
      reportProgress: false // Implement Later
    }).pipe(
      catchError((err: any) => {
        return oof(err);
      }),
      map((valueFromServer: any, index: number) => {
        console.log(valueFromServer);

        return valueFromServer;
      })
    );
  }
}
