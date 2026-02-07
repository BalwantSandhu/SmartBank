import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { AccountTypePipe } from './pipes/account-type.pipe';
import { TransactionFilterPipe } from './pipes/transaction-filter.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from './components/form-input/form-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { FormSelectComponent } from './components/form-select/form-select.component';



@NgModule({
  declarations: [
    CustomButtonComponent,
    CustomCurrencyPipe,
    AccountTypePipe,
    TransactionFilterPipe,
    FormInputComponent,
    RadioGroupComponent,
    FormSelectComponent
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
    ReactiveFormsModule,
    FormInputComponent,
    RadioGroupComponent,
    FormSelectComponent
  ]
})
export class SharedModule { }
