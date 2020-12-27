import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {

  @Input() label:string;
  @Input() type = 'text'

  constructor(@Self() public ngControl:NgControl) {
    this.ngControl.valueAccessor = this;
   }
  onChange: (_: any) => void;
  onTouched: () => void;

  writeValue(value: any): void {
  }
  registerOnChange(fn: (_: any) => void): void {
  }
  registerOnTouched(fn: () => void): void {
  }

}
