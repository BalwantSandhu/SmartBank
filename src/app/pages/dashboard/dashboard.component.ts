import { Component } from '@angular/core';
import { Account, AccountType, Transaction } from '../../core/models/account.model';
import { Observable } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalBalance: number = 0;
  chequingBalance: number = 0;
  savingsBalance: number = 0
  recentTransactions: Transaction[] = [];

  accounts$!: Observable<Account[]>;
  transaction$!: Observable<Transaction[]>;

  allAccounts: Account[] = [];
  displayedAccounts: Account[] = [];
  accountsToShow: number = 5;
  showAllAccounts: boolean = false;
  
  constructor(private accountService: AccountService, private router: Router){}

  ngOnInit(): void{
    this.loadDashboardData();
  }

  private loadDashboardData(): void{
    this.accounts$ = this.accountService.getAccounts();
    this.accounts$.subscribe((accounts) => {
      this.allAccounts = accounts;
      this.updateDisplayedAccounts();
      this.calculateBalances(accounts);
    });

    this.transaction$ = this.accountService.getTransactions();
    this.transaction$.subscribe((transaction) => {
      this.recentTransactions = transaction.slice(0, 5);
    });
  }

  private updateDisplayedAccounts(): void{
    if(this.showAllAccounts){
      this.displayedAccounts = this.allAccounts;
    } else {
      this.displayedAccounts = this.allAccounts.slice(0, this.accountsToShow);
    }
  }

  toggleShowAllAccount(): void{
    this.showAllAccounts = !this.showAllAccounts;
    this.updateDisplayedAccounts();
  }

  get hasMoreAccounts(): boolean{
    return this.allAccounts.length > this.accountsToShow;
  }

  get hiddenAccountsCount(): number{
    return this.allAccounts.length - this.accountsToShow;
  }

  private calculateBalances(accounts: Account[]): void{
    this.totalBalance = this.accountService.getTotalBalance();

    this.chequingBalance = this.accountService
      .getAccountsByType(AccountType.CHEQUING)
      .reduce((sum, acc) => sum + acc.balance, 0);

    this.savingsBalance = this.accountService
      .getAccountsByType(AccountType.SAVINGS)
      .reduce((sum, acc) => sum + acc.balance, 0);

  }

  navigateToCreateAccount(): void{
    this.router.navigate(['/accounts/create']);
  }

  navigateToTransfer(): void{
    this.router.navigate(['/transactions/transfer']);
  }

  navigateToHistory(): void{
    this.router.navigate(['/transactions/history']);
  }

  getAccountName(accountId: string): string{
    const account = this.accountService.getAccountById(accountId);
    return account ? `${account.accountHolderName} (${account.accountNumber})` : 'Unknown';
  }
}
