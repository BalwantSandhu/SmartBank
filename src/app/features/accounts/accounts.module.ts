import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AccountListComponent } from './account-list/account-list.component';
import { SharedModule } from '../../shared/shared.module';
import { share } from 'rxjs';


@NgModule({
  declarations: [
    CreateAccountComponent,
    AccountListComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AccountsModule { }
