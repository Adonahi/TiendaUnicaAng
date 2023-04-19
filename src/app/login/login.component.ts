import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  cargando = false;
  loginForm: FormGroup;
  

  constructor(
    private _formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });  
  }

  iniciarSesion(){
    if(this.loginForm.valid){
      this.cargando = true;
    }
  }

}
