import { DatePipe } from '@angular/common';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  productosFiltrados: any[] = [];

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
  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private _ventaService: VentaService,
    private _compraService: CompraService,
    private _router: Router,
    private datePipe: DatePipe
  ) {
    this.titulo = this._router.url == '/compras' ? "Compras" : "Ventas";
    
    this.range.valueChanges.subscribe(() => {
      this.dataSource1.data = this.productos;
      this.dataSource2.data = this.productos;
      if (this.range.value.start && this.range.value.end) {
        this.filtrar(this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd'), this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd'))
      }
    });
  }

  ngAfterViewInit(): void {
    let obs = this._router.url == '/compras' ?
      this._compraService.getCompraProductoPorUsuario(this._authService.usuario.usuario_id) :
      this._ventaService.getVentaProductoPorUsuario(this._authService.usuario.usuario_id);
    obs.subscribe((productos: any[]) => {
      this.productosFiltrados = this.productos = productos;
      this.isLoadingResults = true;
      this.dataSource1.data = productos;
      this.dataSource2.data = productos;
      this.dataSource1.paginator = this.paginator1;
      this.dataSource2.paginator = this.paginator2;
      this.dataSource1.sort = this.sort;
      this.dataSource2.sort = this.sort;
      this.isLoadingResults = false;
    });
  }

  verTicket(producto: any) {
    let obs = this._router.url == '/compras' ?
      this._compraService.getCompraPorId(producto.compra_id) :
      this._ventaService.getVentaPorId(producto.venta_id);
    obs.subscribe((productos: any[]) =>{
      this.dialog.open(TicketDialogComponent, {
        data: {
          titulo: "Detalle en Ticket",
          contenido: productos
        }
      })
    });
  }

  filtrar(fechaInicio: any, fechaFin: any){
    this.productosFiltrados = [];
    let milisecInicio = new Date(fechaInicio);
    let milisecFin = new Date(fechaFin);
    this.productos.forEach(producto =>{
      let milisecProducto = new Date(producto.fecha.split(" ")[0]);
      if(milisecProducto.getTime() >= milisecInicio.getTime() && milisecProducto.getTime() <= milisecFin.getTime()){
        this.productosFiltrados.push(producto);
      }
    });
    this.dataSource1.data = this.productosFiltrados;
    this.dataSource2.data = this.productosFiltrados;
  }

}
