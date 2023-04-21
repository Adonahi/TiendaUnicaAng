import { HttpHeaders} from "@angular/common/http";

export const URL = 'http://localhost:8080/';

export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const PRODUCTO = 'producto';
export const VENTA = 'venta';
export const VENTAPRODUCTO = 'venta_producto';
export const COMPRA = 'compra';
export const COMPRAPRODUCTO = 'compra_producto';

let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json')
    headers = headers.append('Access-Control-Allow-Origin', '*' )
    headers = headers.append('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');        

localStorage.getItem('loggedInUser');
export let OPTIONS = {    
    headers
};