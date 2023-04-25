import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CompraService } from '../services/compra.service';
import { VentaService } from '../services/venta.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html'
})
export class EstadisticasComponent implements OnInit{

  ventas: any[] = [];
  compras: any[] = [];
  ventasFiltro: any[] = [];
  comprasFiltro: any[] = [];

  constructor(
    private _authService: AuthService,
    private _ventaService: VentaService,
    private _compraService: CompraService,
  ){
    this._ventaService.getVentaProductoPorUsuario(this._authService.usuario.usuario_id)
    .subscribe(productos => this.ventas = productos);
    this._compraService.getCompraProductoPorUsuario(this._authService.usuario.usuario_id)
    .subscribe(productos => this.compras = productos);
  }

  ngOnInit(): void {
    console.log(this.ventas);
    console.log(this.compras);
  }

}
