import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-custom-button',
  standalone: false,
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent {
  @Input() label: string = 'Submit';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() accountType?: AccountType;
  @Input() buttonStyle: 'primary' | 'secondary' | 'danger' = 'primary';
  @Output() btnClick = new EventEmitter<void>();

  onClick(): void{
    if(!this.disabled){
      this.btnClick.emit();
    }
  }

  getButtonClass(): string {
    if(this.accountType){
      return this.accountType === AccountType.CHEQUING ? 'btn-chequing' : 'btn-savings';
    }
    return `btn-${this.buttonStyle}`;
  }
}
