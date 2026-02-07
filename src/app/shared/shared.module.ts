import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { AccountTypePipe } from './pipes/account-type.pipe';
import { TransactionFilterPipe } from './pipes/transaction-filter.pipe';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CustomButtonComponent,
    CustomCurrencyPipe,
    AccountTypePipe,
    TransactionFilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CustomButtonComponent,
    CustomCurrencyPipe,
    AccountTypePipe,
    TransactionFilterPipe,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
