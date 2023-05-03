import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router
    ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      if (!(route.url[0]?.path == 'login' || route.url[0]?.path == 'punto_venta')) {
        console.log("No inició sesión")
        this.authService.logoutUser(this.authService.usuario?.usuario_id.toString()).subscribe(
          data => {
            this.router.navigate(['login']).then(() => window.location.reload());;
            return false;
          }
        );
      }
      return true;
    }

    if (route.url[0]?.path === 'login' && this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }


    const expectedRole = route.data['role'];
    let aux: any = jwtDecode(JSON.parse("" + localStorage.getItem('loggedInUser')).token)
    const tokenPayload = aux['data']['permiso'];


    if (expectedRole) {
      if (!expectedRole.includes(tokenPayload)) {
        console.log("Sin permiso");
        this.router.navigate(['']);
        return false;
      }
    }
    return true;
  }

}
