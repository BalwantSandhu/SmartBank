import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Account } from '../../../core/models/account.model';
import { SelectOption } from '../../../shared/components/form-select/form-select.component';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { count } from 'rxjs';

@Component({
  selector: 'app-fund-transfer',
  standalone: false,
  templateUrl: './fund-transfer.component.html',
  styleUrl: './fund-transfer.component.scss'
})
export class FundTransferComponent {
  transferForm!: FormGroup;
  accounts: Account[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;
  message: string = '';
  isRedirecting: boolean = false;
  countdown: number = 3;

  fromAccountOptions: SelectOption[] = [];
  toAccountOptions: SelectOption[] = [];

  constructor(private accountService: AccountService, private router: Router){}

  ngOnInit(): void{
    this.loadAccounts();
    this.initializeForm();
  }

  private loadAccounts(){
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      this.updateFromAccountOptions();
    })
  }

  private updateFromAccountOptions(): void {
    this.fromAccountOptions = this.accounts.map((account) => ({
      value: account.id,
      label: `${account.accountNumber} - ${account.accountHolderName} (${account.balance.toFixed(2)})`
    }));
  }

  private updateToAccountOptions(): void{
    const fromAccountId = this.transferForm.get('fromAccountId')?.value;

    this.toAccountOptions = this.accounts
    .filter(account => account.id !== fromAccountId)
    .map((account) => ({
      value: account.id,
      label: `${account.accountNumber} - ${account.accountHolderName}`
    }));
  }

  private initializeForm(): void{
    this.transferForm = new FormGroup({
      fromAccountId: new FormControl('',[
        Validators.required
      ]),
      toAccountId: new FormControl('',[
        Validators.required
      ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
    }, {validators: this.differentAccountValidator});

    this.transferForm.get('fromAccountId')?.valueChanges.subscribe(() => {
      this.updateToAccountOptions();
      this.updateAmountValidator();
      //this.transferForm.get('toAccountId')?.setValue('');
    })
  }

  private differentAccountValidator(control: AbstractControl): ValidationErrors | null {
    const fromAccountId = control.get('fromAccountId')?.value;
    const toAccountId = control.get('toAccountId')?.value;

    if(fromAccountId && toAccountId && fromAccountId === toAccountId){
      return { sameAccount: true};
    }

    return null;
  }

  private updateAmountValidator(){
    const fromAccountId = this.transferForm.get('fromAccountId')?.value;
    const fromAccount = this.accounts.find(account => account.id === fromAccountId);

    const amountControl = this.transferForm.get('amount');
    if(fromAccount){
      amountControl?.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(fromAccount.balance),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]);
      amountControl?.updateValueAndValidity();
    }
  }

  get selectedFromAccount(): Account | undefined{
    const fromAccountId = this.transferForm.get('fromAccountId')?.value;
    return this.accounts.find(account => account.id === fromAccountId);
  }

  get selectedToAccount(): Account | undefined{
    const toAccountId = this.transferForm.get('toAccountId')?.value;
    return this.accounts.find(account => account.id === toAccountId);
  }

  get transferAmount(): number{
    // const value = this.transferForm.get('amount')?.value ?? 0;
    return parseFloat(this.transferForm.get('amount')?.value || 0);
  }

  goBack(){
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void{
    if(this.transferForm.invalid){
      this.transferForm.markAllAsTouched();
      return;
    }

    const { fromAccountId, toAccountId, amount, description } = this.transferForm.getRawValue();

    try{
      this.accountService.transferFunds(
        fromAccountId,
        toAccountId,
        parseFloat(amount),
        description
      );

      this.message = `Succesfully transferred $${amount}!`
      this.showSuccess = true;
      this.showError = false;
      this.isRedirecting = true;

      this.startCountdown();
    } catch(error: any){
      this.message = error.message || 'Transfer failed please try again.';
      this.showError = true;
      this.showSuccess = false;
    }
  }

  private startCountdown(){
    const countdownInterval = setInterval(() => {
      this.countdown--;

      if(this.countdown === 0){
        clearInterval(countdownInterval);
        this.router.navigate(['/dashboard']);
      }
    }, 1000);
  }
}
