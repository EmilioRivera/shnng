import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as _ from 'lodash';

export let ipMethods: (string|symbol)[] = [];
export let ipDescriptors: TypedPropertyDescriptor<any>[] = [];

// tslint:disable-next-line:max-line-length
const ip: (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>
    = (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        // console.log('IP decorator called');
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        ipMethods.push(key);
        ipDescriptors.push(descriptor);
        const originalMethod: any = descriptor.value;
        descriptor.value = function (): void {
            const args: _.LoDashImplicitWrapper<IArguments> = _(arguments).mapValues();
            const stringArgs: string = args.map((a) => JSON.stringify(a)).join();
            // tslint:disable-next-line:no-invalid-this
            const result: any = originalMethod.apply(this, arguments);
            // tslint:disable-next-line:no-console
            console.log(`Call: ${key}(${stringArgs}) => ${JSON.stringify(result)}`);

            return result;
        };

        return descriptor;
    };

@Injectable()
export class HService {
    public constructor(private http: HttpClient) {
        this.instanceNumber = ++HService.countOfConstructor;
        // console.log(this.instanceNumber);
    }

    private static countOfConstructor: number = 0;
    public readonly API_URL: string = 'http://httpbin.org';
    public readonly API_URL_IP: string = this.API_URL + '/ip';
    public readonly instanceNumber: number;

    @ip
    public async naiveGetIp(): Promise<Object> {
        return this.http.get(this.API_URL_IP).toPromise();
    }

    @ip
    public async lessNaiveGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).toPromise().then((value) => value['origin'] as string);
    }

    @ip
    public async somewhatOkGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
            map((objectAsJson) => {
                return objectAsJson['origin'];
            }))
            .toPromise();
    }

    @ip
    public async betterGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
            map((objectAsJson) => objectAsJson['origin'])
        ).toPromise();
    }

    @ip
    public async verboseGetIp(): Promise<string> {
        return this.http.get(this.API_URL_IP).pipe(
            catchError((operation, result) => {
                console.warn(operation, result);

                return of(result);
            }),
            map((valueFromServer: Object) => valueFromServer['origin'] as string)
        )
            .toPromise()
            .catch(async (reject) => {
                // console.warn(reject);

                return Promise.resolve('UNABLE TO GET VALUE');
            });
    }

    public unrelatedMethod(): number {
        // tslint:disable-next-line:no-magic-numbers
        return 42;
    }
}
