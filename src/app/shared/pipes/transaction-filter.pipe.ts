import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../../core/models/account.model';

@Pipe({
  name: 'transactionFilter',
  standalone: false
})
export class TransactionFilterPipe implements PipeTransform {

  transform(transactions: Transaction[], searchTerm: string): Transaction[] {
    if(!transactions || searchTerm){
      return transactions;
    }

    searchTerm = searchTerm.toLowerCase();

    return transactions.filter((transaction) => 
      transaction.description.toLowerCase().includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm) ||
      transaction.type.toLowerCase().includes(searchTerm)
    );
  }
}
