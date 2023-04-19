import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario } from '../classes/usuario.class';
import { OPTIONS } from './config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedUserSubject: BehaviorSubject<any>;
  public loggedInUser: Observable<any>;
  public usuario: Usuario;

  jwtHelper = new JwtHelperService();

  constructor(http: HttpClient) { 
    this.loggedUserSubject = new BehaviorSubject(JSON.parse("" + localStorage.getItem('loggedInUser')));
    this.loggedInUser = this.loggedUserSubject.asObservable();
    if (this.loggedUserSubject.value) {
      //this.usuario = jwtDecode(this.loggedInUserValue.token)['data'];
      OPTIONS.headers = OPTIONS.headers.set('usuario', this.usuario.usuario_id.toString());
      OPTIONS.headers = OPTIONS.headers.set('Authorizatio', 'Bearer '+JSON.parse("" + localStorage.getItem('loggedInUser')).token);
    }
  }


  public get loggedInUserValue() {
    return this.loggedUserSubject.value;
  }

}
