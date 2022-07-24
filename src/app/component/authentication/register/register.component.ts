import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Validation from 'src/app/models/validation';
import { GlobalService } from 'src/app/shared-service/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  register:FormGroup;
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  constructor(private globalservie:GlobalService,private router:Router,private fb: FormBuilder,private toastr:ToastrService)
   { 
    this.register=this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.regexp)]],
      acceptTerms: [false, Validators.requiredTrue],
      password:['',Validators.compose([
        Validators.required,
        Validators.minLength(6),Validators.maxLength(15),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
      ])],
      confirmPassword:['', [Validators.required]]},
      {
        validators: [Validation.match('password', 'confirmPassword')]
      });
   }

  get f() { return this.register.controls; }

  ngOnInit(): void {
  }
  onSubmit()
  {
    let email=this.register.controls.email.value;
    let password=this.register.controls.password.value;
    this.globalservie.emailSignup(email,password).then(value => {
     this.toastr.success("User Register Sucessfully..");
     this.register.reset();
     this.router.navigate(['/login']);
    })
    .catch(err => {   
      this.toastr.error(err.message);
      this.register.reset();
    });
  }

}
