import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class HService {
    constructor(private http: HttpClient) {}

    public readonly API_URL = 'http://httpbin.org';
    public readonly API_URL_IP = this.API_URL + '/ip';

    public naiveGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).toPromise();
    }

    public lessNaiveGetIp(): Promise<Object> {
        return this.http.get(this.API_URL_IP).toPromise().then((value) => value['origin']);
    }

    public somewhatOkGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
                map( (objectAsJson) => {
                    return objectAsJson['origin'];
                }))
            .toPromise();
    }

    public betterGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
            map ((objectAsJson) => objectAsJson['origin'])
        ).toPromise();
    }

    public verboseGetIp = ():  Promise<string> => {
        return this.http.get(this.API_URL_IP).pipe(
            catchError((operation, result) => {
                console.warn(operation, result);
                return of(result);
            }),
            map((valueFromServer: Object) => valueFromServer['origin'] as string)
        )
        .toPromise()
        .catch((reject) => {
            console.warn(reject);
            return Promise.resolve('UNABLE TO GET VALUE');
        });
    }
}
