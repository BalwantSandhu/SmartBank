import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account, AccountType, Transaction, TransactionType, TransactionStatus } from '../models/account.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly ACCOUNTS_KEY = 'banking_app_accounts';
  private readonly TRANSACTIONS_KEY = 'banking_app_transactions';

  private accounts$ = new BehaviorSubject<Account[]>([]);
  private transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(private storageService: StorageService) {
    this.loadDataFromStorage();
  }

  // Load data from localStorage on service initialization
  private loadDataFromStorage(): void {
    // Load accounts
    const savedAccounts = this.storageService.getItem<Account[]>(this.ACCOUNTS_KEY);
    if (savedAccounts && savedAccounts.length > 0) {
      // Convert date strings back to Date objects
      const accounts = savedAccounts.map(acc => ({
        ...acc,
        createdDate: new Date(acc.createdDate)
      }));
      this.accounts$.next(accounts);
    } else {
      // Load sample data if no saved data
      this.loadSampleData();
    }

    // Load transactions
    const savedTransactions = this.storageService.getItem<Transaction[]>(this.TRANSACTIONS_KEY);
    if (savedTransactions && savedTransactions.length > 0) {
      // Convert date strings back to Date objects
      const transactions = savedTransactions.map(trans => ({
        ...trans,
        transactionDate: new Date(trans.transactionDate)
      }));
      this.transactions$.next(transactions);
    }
  }

  // Save accounts to localStorage
  private saveAccountsToStorage(): void {
    this.storageService.setItem(this.ACCOUNTS_KEY, this.accounts$.value);
  }

  // Save transactions to localStorage
  private saveTransactionsToStorage(): void {
    this.storageService.setItem(this.TRANSACTIONS_KEY, this.transactions$.value);
  }

  // Load sample data (for first-time users)
  private loadSampleData(): void {
    const sampleAccounts: Account[] = [
      // {
      //   id: '1',
      //   accountNumber: 'CHQ-1001',
      //   accountHolderName: 'John Doe',
      //   accountType: AccountType.CHEQUING,
      //   balance: 5000,
      //   createdDate: new Date('2024-01-15'),
      //   isActive: true
      // },
      // {
      //   id: '2',
      //   accountNumber: 'SAV-2001',
      //   accountHolderName: 'Jane Smith',
      //   accountType: AccountType.SAVINGS,
      //   balance: 10000,
      //   createdDate: new Date('2024-01-20'),
      //   isActive: true
      // }
    ];

    const sampleTransactions: Transaction[] = [
      // {
      //   id: '1',
      //   fromAccountId: '1',
      //   toAccountId: '2',
      //   amount: 500,
      //   transactionDate: new Date('2024-02-01'),
      //   description: 'Transfer to savings',
      //   type: TransactionType.TRANSFER,
      //   status: TransactionStatus.COMPLETED
      // }
    ];

    this.accounts$.next(sampleAccounts);
    this.transactions$.next(sampleTransactions);
    
    // Save sample data
    this.saveAccountsToStorage();
    this.saveTransactionsToStorage();
  }

  // Get all accounts
  getAccounts(): Observable<Account[]> {
    return this.accounts$.asObservable();
  }

  // Get account by ID
  getAccountById(id: string): Account | undefined {
    return this.accounts$.value.find(acc => acc.id === id);
  }

  // Create new account
  createAccount(account: Omit<Account, 'id' | 'accountNumber' | 'createdDate' | 'isActive'>): Account {
    const newAccount: Account = {
      ...account,
      id: this.generateId(),
      accountNumber: this.generateAccountNumber(account.accountType),
      createdDate: new Date(),
      isActive: true
    };

    const currentAccounts = this.accounts$.value;
    const updatedAccounts = [...currentAccounts, newAccount];
    
    this.accounts$.next(updatedAccounts);
    this.saveAccountsToStorage();
    
    return newAccount;
  }

  // Transfer funds between accounts
  transferFunds(fromAccountId: string, toAccountId: string, amount: number, description: string): boolean {
    const fromAccount = this.getAccountById(fromAccountId);
    const toAccount = this.getAccountById(toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Update balances
    const updatedAccounts = this.accounts$.value.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.id === toAccountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    });

    this.accounts$.next(updatedAccounts);
    this.saveAccountsToStorage();

    // Create transaction record
    const transaction: Transaction = {
      id: this.generateId(),
      fromAccountId,
      toAccountId,
      amount,
      transactionDate: new Date(),
      description,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED
    };

    const currentTransactions = this.transactions$.value;
    const updatedTransactions = [transaction, ...currentTransactions];
    
    this.transactions$.next(updatedTransactions);
    this.saveTransactionsToStorage();

    return true;
  }

  // Get all transactions
  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  // Get transactions by account ID
  getTransactionsByAccountId(accountId: string): Observable<Transaction[]> {
    return new Observable(observer => {
      this.transactions$.subscribe(transactions => {
        const filtered = transactions.filter(
          t => t.fromAccountId === accountId || t.toAccountId === accountId
        );
        observer.next(filtered);
      });
    });
  }

  // Get total balance across all accounts
  getTotalBalance(): number {
    return this.accounts$.value.reduce((sum, acc) => sum + acc.balance, 0);
  }

  // Get accounts by type
  getAccountsByType(type: AccountType): Account[] {
    return this.accounts$.value.filter(acc => acc.accountType === type);
  }

  // Clear all data
  clearAllData(): void {
    this.accounts$.next([]);
    this.transactions$.next([]);
    this.storageService.removeItem(this.ACCOUNTS_KEY);
    this.storageService.removeItem(this.TRANSACTIONS_KEY);
  }

  // Reset to sample data
  resetToSampleData(): void {
    this.clearAllData();
    this.loadSampleData();
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate account number
  private generateAccountNumber(type: AccountType): string {
    const prefix = type === AccountType.CHEQUING ? 'CHQ' : 'SAV';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  }
}