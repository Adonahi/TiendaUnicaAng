import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Producto } from '../classes/producto.class';
import { OPTIONS, PRODUCTO, URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  producto: Producto = new Producto(0, '', '', 0, 0, 0, 0);
  productos: Producto[] = [];

  constructor(private http: HttpClient) { }

  getAll(){

  }

  insertar(producto: Producto): Observable<Producto> {
    const url = `${URL}${PRODUCTO}`;
    return this.http
    .post<Producto>(url, producto, OPTIONS)
  }

}
