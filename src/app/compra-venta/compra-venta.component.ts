import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Producto } from '../classes/producto.class';
import { TicketDialogComponent } from '../dialogs/ticket-dialog/ticket-dialog.component';
import { AuthService } from '../services/auth.service';
import { CompraService } from '../services/compra.service';
import { VentaService } from '../services/venta.service';

@Component({
  selector: 'app-compra-venta',
  templateUrl: './compra-venta.component.html'
})
export class CompraVentaComponent implements AfterViewInit {

  titulo = "";

  productos: any[] = [];

  //Pa la tabla
  displayedColumns: string[] = [
    'fecha',
    'nombre',
    'precio_unitario',
    'cantidad',
    'precio_total',
    'ver_ticket'
  ];

  isLoadingResults: boolean = false;
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private _ventaService: VentaService,
    private _compraService: CompraService,
    private _router: Router
  ) {
    this.titulo = this._router.url == '/compras' ? "Compras" : "Ventas";
  }

  ngAfterViewInit(): void {
    let obs = this._router.url == '/compras' ?
      this._compraService.getCompraProductoPorUsuario(this._authService.usuario.usuario_id) :
      this._ventaService.getVentaProductoPorUsuario(this._authService.usuario.usuario_id);
    obs.subscribe((productos: any[]) => {
      this.isLoadingResults = true;
      this.dataSource.data = productos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
    });
  }

  verTicket(producto: any) {
    console.log(producto);
    let obs = this._router.url == '/compras' ?
      this._compraService.getCompraPorId(producto.compra_id) :
      this._ventaService.getVentaPorId(producto.venta_id);
    obs.subscribe((productos: any[]) =>{
      console.log(productos);
      this.dialog.open(TicketDialogComponent, {
        data: {
          titulo: "Detalle en Ticket",
          contenido: productos
        }
      })
    });
  }

}
