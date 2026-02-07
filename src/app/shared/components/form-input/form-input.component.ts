import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: false,
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent {
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() inputType: string = 'text';
  @Input() placeholder: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() hint: string = '';

  showErrors(): boolean {
    return (this.control && this.control.invalid && this.control.touched);
  }

  getErrorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    if (this.control.errors['required']) {
      return `${this.label} is required`;
    }
    if (this.control.errors['minlength']) {
      const minLength = this.control.errors['minlength'].requiredLength;
      return `${this.label} must be at least ${minLength} characters`;
    }
    if (this.control.errors['maxlength']) {
      const maxLength = this.control.errors['maxlength'].requiredLength;
      return `${this.label} must not exceed ${maxLength} characters`;
    }
    if (this.control.errors['min']) {
      const min = this.control.errors['min'].min;
      return `${this.label} must be at least ${min}`;
    }
    if (this.control.errors['max']) {
      const max = this.control.errors['max'].max;
      return `${this.label} cannot exceed ${max}`;
    }
    if (this.control.errors['pattern']) {
      return `${this.label} format is invalid`;
    }
    if (this.control.errors['email']) {
      return `Please enter a valid email address`;
    }

    return 'Invalid field';
  }

}
