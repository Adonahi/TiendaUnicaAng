import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { COMPRA, COMPRAPRODUCTO, OPTIONS, URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient) { }

  guardarCompra(venta: any): Observable<any>{
    const url = `${URL}${COMPRA}`;
    return this.http
    .post<any>(url, venta, OPTIONS)
    .pipe(catchError(this.handleError<any>()));
  }


  guardarCompraProducto(ventaProducto: any): Observable<any> {
    const url = `${URL}${COMPRAPRODUCTO}`;
    return this.http
    .post<any>(url, ventaProducto, OPTIONS)
    .pipe(catchError(this.handleError<any>()));
  }

  getCompraProductoPorUsuario(usuario_id: number): Observable<any[]>{
    const url = `${URL}${COMPRAPRODUCTO}/getPorUsuario/${usuario_id}`;
    return this.http.get<any[]>(url, OPTIONS);
  }

  getCompraPorId(id: number): Observable<any[]>{
    const url = `${URL}${COMPRA}/${id}`;
    return this.http.get<any[]>(url, OPTIONS);
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
