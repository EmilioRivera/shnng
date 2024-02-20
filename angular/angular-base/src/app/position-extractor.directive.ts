import { Directive, ElementRef, HostListener, Output, EventEmitter, Renderer } from '@angular/core';
import { clamp } from 'lodash';
@Directive({
  selector: '[appPositionExtractor]'
})
export class PositionExtractorDirective {

  private nativeElement: HTMLElement;
  @Output() public appPosition: EventEmitter<number[]>;

  public constructor() {
    this.appPosition = new EventEmitter<number[]>();
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: any): void {
    const target: any = event.target as HTMLElement;
    // tslint:disable-next-line:no-magic-numbers
    const xPosition: number = (event.offsetX / target.clientWidth) * 2 - 1;
    // tslint:disable-next-line:no-magic-numbers
    const yPosition: number = -(event.offsetY / target.clientHeight) * 2 + 1;
    // console.log(`(${s.clientWidth}, ${s.clientHeight})`);
    // console.log(event);
    // console.log(`(${xPosition}$ , ${yPosition})`)
    this.appPosition.emit([clamp(xPosition, -1, 1), clamp(yPosition, -1, 1)]);
  }
}
