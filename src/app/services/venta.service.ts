import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs'
import { OPTIONS, URL, VENTA, VENTAPRODUCTO } from './config';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http: HttpClient) { }

  guardarVenta(venta: any): Observable<any>{
    const url = `${URL}${VENTA}`;
    return this.http
    .post<any>(url, venta, OPTIONS)
    .pipe(catchError(this.handleError<any>()));
  }


  guardarVentaProducto(ventaProducto: any): Observable<any> {
    const url = `${URL}${VENTAPRODUCTO}`;
    return this.http
    .post<any>(url, ventaProducto, OPTIONS)
    .pipe(catchError(this.handleError<any>()));
  }

  getVentaProductoPorUsuario(usuario_id: number): Observable<any[]>{
    const url = `${URL}${VENTAPRODUCTO}/getPorUsuario/${usuario_id}`;
    return this.http.get<any[]>(url, OPTIONS);
  }

  getVentaPorId(id: number): Observable<any[]>{
    const url = `${URL}${VENTA}/${id}`;
    return this.http.get<any[]>(url, OPTIONS);
  }

  getPorUsuarioPorProducto(usuario_id: number): Observable<any[]>{
    const url = `${URL}${VENTAPRODUCTO}/getPorUsuarioPorProducto/${usuario_id}`;
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
