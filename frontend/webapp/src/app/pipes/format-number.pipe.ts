import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatNumber' })
export class FormatNumberPipe implements PipeTransform {

  /**
   * @memberof PipeTransform
   */
  public transform(value: number, decimalDigits: number): string {
    return value.toFixed(decimalDigits);
  }
}
