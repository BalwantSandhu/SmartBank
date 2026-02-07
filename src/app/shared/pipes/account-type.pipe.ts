import { Pipe, PipeTransform } from '@angular/core';
import { AccountType } from '../../core/models/account.model';

@Pipe({
  name: 'accountType',
  standalone: false
})
export class AccountTypePipe implements PipeTransform {

  transform(value: AccountType): string {
    switch(value){
      case AccountType.CHEQUING:
        return 'Chequing Account';
      case AccountType.SAVINGS:
        return 'Savings Account';
      default:
        return value;
    }
  }
}
