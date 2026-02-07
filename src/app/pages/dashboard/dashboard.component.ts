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
  
  constructor(private accountService: AccountService, private router: Router){}

  ngOnInit(): void{
    this.loadDashboardData();
  }

  private loadDashboardData(): void{
    this.accounts$ = this.accountService.getAccounts();
    this.accounts$.subscribe((accounts) => {
      this.calculateBalances(accounts);
    });

    this.transaction$ = this.accountService.getTransactions();
    this.transaction$.subscribe((transaction) => {
      this.recentTransactions = transaction.slice(0, 5);
    });
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
