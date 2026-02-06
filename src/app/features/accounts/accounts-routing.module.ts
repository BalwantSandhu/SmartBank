import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AccountListComponent } from './account-list/account-list.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateAccountComponent
  },
  {
    path: 'list',
    component: AccountListComponent
  },
  {
    path: '',
    redirectTo:'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
