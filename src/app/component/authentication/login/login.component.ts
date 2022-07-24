import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared-service/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login:FormGroup;

constructor(private globalservie:GlobalService,private router:Router,private fb: FormBuilder,private toastr:ToastrService) { 
  this.login=this.fb.group({
    email: ['', [Validators.required]],
    password:['', [Validators.required]],
    });
}
get f() { return this.login.controls;}
ngOnInit(): void {
}
doLogin()
{
  let email=this.login.controls.email.value;
  let password=this.login.controls.password.value;
  this.globalservie.login(email,password).then(value => {
   this.toastr.success("User Logged Sucessfully..");
   localStorage.setItem('LoggedIn','true')
   this.login.reset();
   this.router.navigate(['user/show-product']);
  })
  .catch(err => {
    this.toastr.error(err.message);
    this.login.reset();
    // console.log('Something went wrong: ', err.message);
  });
}
}
