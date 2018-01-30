import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as _ from 'lodash';

export let ipMethods = [];
export let ipDescriptors = [];

// tslint:disable-next-line:max-line-length
function ip(target: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
    console.log('IP decorator called');
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    ipMethods.push(key);
    ipDescriptors.push(descriptor);
    const originalMethod = descriptor.value;
    descriptor.value = function() {
        const args = _(arguments).mapValues();
        const stringArgs = args.map((a) => JSON.stringify(a)).join();
        const result = originalMethod.apply(this, arguments);
        console.log(`Call: ${key}(${stringArgs}) => ${JSON.stringify(result)}`);
        return result;
    };

    return descriptor;
}

@Injectable()
export class HService {
    constructor(private http: HttpClient) {
        this.instanceNumber = ++HService.countOfConstructor;
        console.log(this.instanceNumber);
    }

    private static countOfConstructor = 0;
    public readonly API_URL = 'http://httpbin.org';
    public readonly API_URL_IP = this.API_URL + '/ip';
    public readonly instanceNumber: number;

    @ip
    public naiveGetIp(): Promise<Object> {
        return this.http.get(this.API_URL_IP).toPromise();
    }

    @ip
    public lessNaiveGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).toPromise().then((value) => value['origin'] as string);
    }

    @ip
    public somewhatOkGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
                map( (objectAsJson) => {
                    return objectAsJson['origin'];
                }))
            .toPromise();
    }

    @ip
    public betterGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
            map ((objectAsJson) => objectAsJson['origin'])
        ).toPromise();
    }

    @ip
    public verboseGetIp(): Promise<string> {
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
