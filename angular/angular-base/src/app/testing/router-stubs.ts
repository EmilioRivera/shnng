import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { convertToParamMap, ParamMap } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.paramMap is Observable
  private subject: BehaviorSubject<ParamMap> = new BehaviorSubject(convertToParamMap(this.testParamMap));
  public paramMap: Observable<ParamMap> = this.subject.asObservable();

  // Test parameters
  private _testParamMap: ParamMap;
  public get testParamMap(): {} { return this._testParamMap; }
  public set testParamMap(params: {}) {
    this._testParamMap = convertToParamMap(params);
    this.subject.next(this._testParamMap);
  }

  // ActivatedRoute.snapshot.paramMap
  public get snapshot(): {} {
    return { paramMap: this.testParamMap };
  }
}
