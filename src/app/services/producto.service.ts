import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Producto } from '../classes/producto.class';
import { OPTIONS, PRODUCTO, URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  producto: Producto = new Producto(0, '', '', 0, 0, 0, 0, '');
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

  editar(producto: Producto): Observable<Producto> {
    const url = `${URL}${PRODUCTO}`;
    return this.http
    .put<Producto>(url, producto, OPTIONS)
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

  getPorUsuario(usuario_id: number): Observable<Producto[]>{
    const url = `${URL}${PRODUCTO}/getPorUsuario/${usuario_id}`;
    return this.http.get<Producto[]>(url, OPTIONS);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(error.error);
    };
  }

}
