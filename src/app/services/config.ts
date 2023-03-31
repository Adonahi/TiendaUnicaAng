import { HttpHeaders} from "@angular/common/http";

export const URL = 'http://localhost:8080/';

export const PRODUCTO = 'producto';

let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json')
    headers = headers.append('Access-Control-Allow-Origin', '*' )
    headers = headers.append('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');        

export let OPTIONS = {    
    headers
};