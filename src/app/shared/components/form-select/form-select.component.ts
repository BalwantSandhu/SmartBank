import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select',
  standalone: false,
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss'
})
export class FormSelectComponent {
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: SelectOption[] = [];

  selectId: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  errorId: string = `error-${this.selectId}`;
  
  showErrors(): boolean {
    return (this.control && this.control.invalid && this.control.touched);
  }

  getErrorMessage(): string {
    if (this.control?.errors?.['required']) {
      return `${this.label} is required`;
    }
    return 'Invalid selection';
  }
}
