import { Component } from '@angular/core';
import { filter, Observable, retry } from 'rxjs';
import { Account, Transaction } from '../../../core/models/account.model';
import { FormControl } from '@angular/forms';
import { SelectOption } from '../../../shared/components/form-select/form-select.component';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {
  transactions$!: Observable<Transaction[]>;
  accounts: Account[] = [];
  filteredTransactions: Transaction[] = [];
  allTransactions: Transaction[] = [];

  accountFilterControl = new FormControl('');
  searchControl = new FormControl('');

  accountOptions: SelectOption[] = [];

  constructor(private accountService: AccountService){}

  ngOnInit(): void{
    this.loadAccounts();
    this.loadTransactions();
    this.setupFilters();
  }

  private loadAccounts(): void{
    this.accountService.getAccounts().subscribe((accounts) =>{
      this.accounts = accounts;
      this.updateAccountOptions();
    })
  }

  private updateAccountOptions(): void{
    this.accountOptions = [
      {value: '', label: 'All Accounts'},
      ...this.accounts.map((account) => ({
        value: account.id,
        label: `${account.accountNumber} - ${account.accountHolderName}`
      }))
    ];
  }

  private loadTransactions(): void{
    this.transactions$ = this.accountService.getTransactions();
    this.transactions$.subscribe((transactions) => {
      this.allTransactions = transactions;
      this.applyFilters();
    })
  }

  private applyFilters(): void{
    let filtered = [...this.allTransactions];

    const selectedAccountId = this.accountFilterControl.value;
    if(selectedAccountId){
      filtered = filtered.filter((transaction) => 
        // console.log('transaction.fromAccountId: '+ transaction.fromAccountId);
        // console.log('transaction.toAccountId: '+ transaction.toAccountId);
        // console.log('selectedAccountId: ' + selectedAccountId);
        transaction.fromAccountId === selectedAccountId ||
        transaction.toAccountId === selectedAccountId
      );
      console.log(filtered);
    }

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if(searchTerm){
      filtered = filtered.filter((transaction) => 
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm) ||
        this.getAccountName(transaction.fromAccountId).toLowerCase().includes(searchTerm) ||
        this.getAccountName(transaction.toAccountId).toLowerCase().includes(searchTerm)
      )
    }

    this.filteredTransactions = filtered;
  }

  getAccountName(accountId: string): string{
    const account = this.accounts.find(account => account.id === accountId);
    return account ? `${account.accountHolderName} (${account.accountNumber})` : 'Unknown';
  }

  private setupFilters(): void{
    this.accountFilterControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilters();
    })
  }

  clearFilters(): void{
    this.accountFilterControl.setValue('');
    this.searchControl.setValue('');
  }

  get hasActiveFilters(): boolean{
    return !!(this.accountFilterControl.value || this.searchControl.value);
  }
}
