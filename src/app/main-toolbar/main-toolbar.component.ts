import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MENSAJES } from './mensajes';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styles: ['.active{ background-color: #512DA8; } .btn-text{ font-size: 0.6em } .shadow-mb{ position: relative }']
})
export class MainToolbarComponent implements OnInit{

  role: any;
  nombreUsuario: string = '';

  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.role = typeof this.authService.usuario == 'undefined' ? 0 : this.authService.usuario.permiso;
    this.nombreUsuario = typeof this.authService.usuario == 'undefined' ? '' : this.authService.usuario.nombre;
  }

  lanzarSnackBar(){
    this._snackBar.open(MENSAJES[Math.floor(Math.random() * 8)], undefined, { duration: 1500})
  }

  logout(){
    this.authService.logoutUser(this.authService.usuario.usuario_id.toString()).subscribe(
      data => {
        this.router.navigate(['login']).then(() => window.location.reload());
      }
    );
  }

}
