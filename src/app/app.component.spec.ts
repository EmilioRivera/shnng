import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  // We configure a testing module with the
  // async function which is different froms
  // the typical es5 'async'. The one used here
  // is actually defined in the Angular Framework
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    // Notice that we compiled components, because of the external template,
    // but this isn't necessary if we use the Angular 'async' function.
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Material Demo'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Material Demo');
  }));

  it(`should contain a 'main' html element`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const elements = compiled.querySelector('main');
    console.log(elements);
    // Being null and undefined are two different things in JS and in TS
    expect(elements).not.toBeNull();
  }));
});
