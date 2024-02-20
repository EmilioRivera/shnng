import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  public readonly DEFAULT_STRATEGY: string = 'h';

  public readonly supportedSizeTypes: string[] = [
    'h', // Human readable / auto select
    'B', // B
    'K', // KB
    'M', // MB
    'G', // GB
    'T'  // TB
  ];

  public transform(value: number, size?: string): any {
    if (size == null) {
      size = this.DEFAULT_STRATEGY;
    }

    return this.getValueFromStrategy(value, size);
  }

  private getValueFromStrategy(value: number, strategy: string): string {
    // tslint:disable:no-magic-numbers
    let finalVal: string;
    if (strategy === 'h') {
      // tslint:disable-next-line:prefer-conditional-expression
      if (value / 1024 ** 0 < 1024) {
        strategy = 'B';
      } else if (value / 1024 ** 1 < 1024) {
        strategy = 'K';
      } else if (value / 1024 ** 2 < 1024) {
        strategy = 'M';
      } else if (value / 1024 ** 3 < 1024) {
        strategy = 'G';
      } else {
        strategy = 'T';
      }
    }

    // tslint:disable-next-line:prefer-conditional-expression
    if (strategy === 'B') {
      finalVal = value.toString() + 'B';
    } else if (strategy === 'K') {
      finalVal = Math.ceil(value / (1024 ** 1)).toString() + ' KB';
    } else if (strategy === 'M') {
      finalVal = Math.ceil(value / (1024 ** 2)).toString() + ' MB';
    } else if (strategy === 'G') {
      finalVal = Math.ceil(value / (1024 ** 3)).toString() + ' GB';
    } else {
      finalVal = Math.ceil(value / (1024 ** 4)).toString() + ' TB';
    }

    return finalVal;
  }

}
