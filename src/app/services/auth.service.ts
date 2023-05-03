import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';
import { Observable, BehaviorSubject, map, of, catchError } from 'rxjs';
import { Usuario } from '../classes/usuario.class';
import { LOGIN, LOGOUT, OPTIONS, URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedUserSubject: BehaviorSubject<any>;
  public loggedInUser: Observable<any>;
  public usuario: Usuario;

  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { 
    this.loggedUserSubject = new BehaviorSubject(JSON.parse("" + localStorage.getItem('loggedInUser')));
    this.loggedInUser = this.loggedUserSubject.asObservable();
    if (this.loggedUserSubject.value) {
      let aux: any = jwtDecode(this.loggedInUserValue.token);
      this.usuario = aux['data'];
      OPTIONS.headers = OPTIONS.headers.set('usuario', this.usuario.usuario_id.toString());
      OPTIONS.headers = OPTIONS.headers.set('Authorizatio', 'Bearer '+JSON.parse("" + localStorage.getItem('loggedInUser')).token);
    }
  }

  loginUser(correo: string, password: string) {
    const url = `${URL}${LOGIN}`;
    return this.http.post<any>(url, { correo, password }, OPTIONS)
      .pipe(
        map(response => {
          localStorage.setItem('loggedInUser', JSON.stringify(response));
          this.loggedUserSubject.next(response);
          return response;
        }),
        catchError(this.handleError<any>())
      );
  }

  logoutUser(usuario_id: string) {
    const url = `${URL}${LOGOUT}`;
    return this.http.post<any>(url, { usuario_id }, OPTIONS)
      .pipe(
        map(response => {
          localStorage.removeItem('loggedInUser');
          this.loggedUserSubject.next(null);
          return response;
        }),
        catchError(this.handleError<any>())
      )
  }

  public get loggedInUserValue() {
    return this.loggedUserSubject.value;
  }

  isAuthenticated(): boolean {
    if (this.loggedUserSubject.value) {
      const token = this.loggedUserSubject.value.token;

      // Check whether the token is expired and return
      // true or false
      return !this.jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      if (error.error.error === 400) {
        return of(error.error);
      } else {
        return of();
      }
    };
  }
}
