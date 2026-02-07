import { Component } from '@angular/core';
import { Account, Transaction } from '../../core/models/account.model';
import { Observable } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';

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
  recentTransaction: Transaction[] = [];

  accounts$!: Observable<Account[]>;
  transaction$!: Observable<Transaction[]>;
  
  constructor(private accountService: AccountService, private router: Router){}

  ngOnInit(): void{
    this.loadDashboardData();
  }

  private loadDashboardData(): void{}

  navigateToCreateAccount(): void{
    this.router.navigate(['/accounts/create']);
  }

  navigateToTransfer(): void{
    this.router.navigate(['/transactions/transfer']);
  }

  navigateToHistory(): void{
    this.router.navigate(['/transactions/history']);
  }
}
