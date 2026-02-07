import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

const routes: Routes = [
  {
    path: 'transfer',
    component: FundTransferComponent
  },
  {
    path: 'history',
    loadComponent: () =>
    import('./transaction-history/transaction-history.component')
    .then(c => c.TransactionHistoryComponent)
  },
  {
    path: '',
    redirectTo: 'transfer',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
