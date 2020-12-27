import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent:any
  @Output() cancelRegister = new EventEmitter();
  maxDate:Date;
  validationErrors : string[] = [];

  registerForm:FormGroup;

  constructor(private accountService:AccountService, private toastr: ToastrService,
      private fb:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date;
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm()
  {
    this.registerForm = this.fb.group({
      gender:["Male"],
      username:["", Validators.required],
      knownAs:["", Validators.required],
      dateOfBirth:["", Validators.required],
      city:["", Validators.required],
      country:["", Validators.required],
      password:["", [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      confirmPassword:["", [Validators.required,this.compare("password")]],
    })
  }

  compare(compareTo:string) : ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[compareTo].value ?
        null : {isMatching:true}
    }
  }
  register()
  {
    this.accountService.register(this.registerForm.value).subscribe(
      response => {
        console.log(response);
        this.router.navigateByUrl('/members');
      }, error => {
        this.validationErrors = error;
      }
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
