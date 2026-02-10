import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioOption } from '../../../shared/components/radio-group/radio-group.component';
import { AccountType } from '../../../core/models/account.model';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  accountForm!: FormGroup;
  successMessage: string = '';
  isRedirecting: boolean = false;
  countdown: number = 3;

  accountTypeOptions: RadioOption[] = [
    {
      value: AccountType.CHEQUING,
      label: 'Chequing Account',
      description: 'For everyday transactions and payments'
    },
    {
      value: AccountType.SAVINGS,
      label: 'Savings Account',
      description: 'For saving money with interest'
    }
  ];

  constructor(
    private router: Router, 
    private accountService: AccountService, 
    private formBuilder: FormBuilder
  ){}

  ngOnInit(){
    this.initializeForm();
  }

  private initializeForm(): void{
    this.accountForm = this.formBuilder.group({
      accountHolderName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      accountType: [
        AccountType.CHEQUING,
        [
          Validators.required
        ]
      ],
      balance: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/)
        ]
      ]
    });
  }

  get selectedAccountType(): AccountType{
    return this.accountForm.get('accountType')?.value;
  }

  onSubmit(){
    if(this.accountForm.invalid){
      this.accountForm.markAllAsTouched();
      return;
    }

    if(this.isRedirecting){
      return;
    }

    try{
      const formValue = this.accountForm.getRawValue();
      const newAccount = this.accountService.createAccount({
        accountHolderName:formValue.accountHolderName,
        accountType: formValue.accountType,
        balance: parseFloat(formValue.balance)
      })
      
      this.successMessage = `Account ${newAccount.accountNumber} created successfully!`;
      this.isRedirecting = true;

      this.accountForm.disable();

      this.startCountdown();
    } catch(error){
      console.error('Error creating account:', error);
    }
  }

  private startCountdown(): void{
    const countdownInterval = setInterval(() => {
      this.countdown--;

      if(this.countdown === 0){
        clearInterval(countdownInterval);
        this.router.navigate(['/dashboard']);
      }
    }, 1000);
  }

  goBack(): void{
    this.router.navigate(['/dashboard']);
  }
}
