import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: false
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number, currencySymbol: string = '$'): string {
    if( value === null || value === undefined){
      return `${currencySymbol}0.00`;
    }

    const formattedValue = Math.abs(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const sign = value < 0 ? '-' : '';

    return `${sign}${currencySymbol}${formattedValue}`;
  }

}
