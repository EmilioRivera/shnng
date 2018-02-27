import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SERVER_URL } from '../definitions/invariants';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';
import { map, catchError, mergeAll } from 'rxjs/operators';
import { of as oof } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/add/operator/finally';

@Injectable()
export class FileUploaderService {
  public readonly uploadHeaders: HttpHeaders;
  public constructor(private httpClient: HttpClient) {
    this.uploadHeaders = new HttpHeaders({
      'Accept': 'application/json'
    });
  }

  public upload(files: File[]): Observable<IProgress> {
    const x: Observable<IProgress>[] = files.map((file, index) => {
      // For each file we will return an Observable
      const formData: FormData = new FormData();
      formData.append('upload', file, file.name);
      const req: HttpRequest<FormData> = new HttpRequest('POST', SERVER_URL + '/upload', formData, {
        headers: this.uploadHeaders,
        reportProgress: true
      });

      return this.httpClient.request<IProgress>(req).pipe(
        catchError((err: any) => {
          return oof(err);
        }),
        map((event: HttpEvent<any>, emissionIndex: number) => this.progressFromEvent(event, index))
      );
    });

    return x.reduce((p, c) => merge(p, c));
  }

  public multiSingleUpload(files: File[]): Observable<IProgress>[] {
    return files.map((f: File, idx: number) => {
      const formData: FormData = new FormData();
      formData.append(f.name, f);
      const req: HttpRequest<FormData> = new HttpRequest('POST', SERVER_URL + '/upload', formData, {
        headers: this.uploadHeaders,
        reportProgress: true
      });

      return this.httpClient.request(req).pipe(
        map((event) => {
          return this.progressFromEvent(event, idx);
        })
      );
    });
  }

  public progressFromEvent(event: HttpEvent<any>, index?: number): IProgress {
    switch (event.type) {
      case HttpEventType.Sent:
        return { which: 0, progress: 0 };
      case HttpEventType.UploadProgress:
        const prog: number = event.loaded / event.total;
        console.log(`${0}: ${prog}`);

        return { which: 0, progress: prog };
      case HttpEventType.Response:
      case HttpEventType.ResponseHeader:
        return { which: 0, progress: 1 };
      default:
        break;
    }
  }

  public multiUpload(files: File[]): Observable<IProgress> {
    const formData: FormData = new FormData();
    files.forEach((f) => {
      formData.append(f.name, f);
    });

    const req: HttpRequest<FormData> = new HttpRequest('POST', SERVER_URL + '/upload', formData, {
      headers: this.uploadHeaders,
      reportProgress: true
    });

    return this.httpClient.request<IProgress>(req).pipe(
      catchError((err: any) => {
        return oof(err);
      }),
      map((event, i) => this.progressFromEvent(event, 0))
    );
  }
}

export interface IProgress {
  which: number;
  progress: number;
}
