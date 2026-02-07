// Account Types Enum
export enum AccountType {
  CHEQUING = 'CHEQUING',
  SAVINGS = 'SAVINGS'
}

// Account Interface
export interface Account {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: AccountType;
  balance: number;
  createdDate: Date;
  isActive: boolean;
}

// Transaction Types Enum
export enum TransactionType {
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

// Transaction Status Enum
export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

// Transaction Interface
export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transactionDate: Date;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
}