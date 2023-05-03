import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  cargando = false;
  loginForm: FormGroup;
  mensaje = '';
  error = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ){}

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });  
  }

  iniciarSesion(){
    this.error = false;
    if(this.loginForm.valid){
      this.cargando = true;
      this._authService.loginUser(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .subscribe( data =>{
            if (data.status !== 400) {
              if (this._authService.isAuthenticated()) {
                this._router.navigate(['']).then(() => window.location.reload());
              }
            }
            else {
              this.cargando = false;
              console.log(data.messages.error);
              this.mensaje = data.messages.error;
              this.error = true;
            }
      });
    }
  }

}
