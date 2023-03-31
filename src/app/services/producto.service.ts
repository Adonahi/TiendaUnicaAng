import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Producto } from '../classes/producto.class';
import { OPTIONS, PRODUCTO, URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  producto: Producto = new Producto(0, '', '', 0, 0, 0, 0);
  productos: Producto[] = [];

  constructor(private http: HttpClient) { }

  getAll(): Observable<Producto[]>{
    const url = `${URL}${PRODUCTO}`;
    return this.http.get<Producto[]>(url, OPTIONS);
  }

  insertar(producto: Producto): Observable<Producto> {
    const url = `${URL}${PRODUCTO}`;
    return this.http
    .post<Producto>(url, producto, OPTIONS)
    .pipe(catchError(this.handleError<Producto>()));
  }

  eliminar(id: number): Observable<Producto>{
    const url = `${URL}${PRODUCTO}/delete/${id}`;
    return this.http
    .get<Producto>(url, OPTIONS)
    .pipe(catchError(this.handleError<Producto>()));
  }

  getPorId(id: number): Observable<Producto>{
    const url = `${URL}${PRODUCTO}/${id}`;
    return this.http
    .get<Producto>(url, OPTIONS)
    .pipe(catchError(this.handleError<Producto>()));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.error === 400) {
        return of(error.error);
      } else {
        return of(error.error);
      }
    };
  }

}
