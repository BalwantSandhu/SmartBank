import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

@Component({
  selector: 'app-radio-group',
  standalone: false,
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss'
})
export class RadioGroupComponent {
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() options: RadioOption[] = [];
  @Input() inline: boolean = false;

  showErrors(): boolean{
    return (this.control && this.control.invalid && this.control.touched);
  }

  getErrorMessage(): string {
    if(this.control?.errors?.['required']){
        return `${this.label} is required`;
    }
    return 'Invalid selection';
  }
}
