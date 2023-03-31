import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { Producto } from '../classes/producto.class';
import { MensajeEsperaDialogComponent } from '../dialogs/mensaje-espera-dialog/mensaje-espera-dialog.component';
import { MensajePlanoDialogComponent } from '../dialogs/mensaje-plano-dialog/mensaje-plano-dialog.component';
import { MensajeSiNoDialogComponent } from '../dialogs/mensaje-si-no-dialog/mensaje-si-no-dialog.component';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements AfterViewInit {

  productos: Producto[] = [];
  edit: boolean = false;

  //Pa la tabla
  displayedColumns: string[] = [
    'nombre',
    'precio_compra',
    'precio_venta',
    'codigo_barras',
    'editar',
    'eliminar'
  ];

  isLoadingResults: boolean = false;
  dataSource = new MatTableDataSource();


  productoForm = this._formBuilder.group({
    producto_id: [''],
    nombre: ['', Validators.required],
    codigo_barras: [''],
    precio_compra: ['', Validators.required],
    precio_venta: ['', Validators.required]
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _productoService: ProductoService
  ) {

  }

  ngAfterViewInit(): void {
    this.productoForm = this._formBuilder.group({
      producto_id: [''],
      nombre: ['', Validators.required],
      codigo_barras: [''],
      precio_compra: ['', Validators.required],
      precio_venta: ['', Validators.required]
    });

    this._productoService.getAll()
    .subscribe((productos: Producto[]) =>{
      this.isLoadingResults = true;
      this.dataSource.data = productos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
    });

  }

  editar(producto: Producto){
    console.log(producto);
    this.edit = true;
    this._productoService.getPorId(producto.producto_id)
    .subscribe(r =>{
      
    });
  }

  eliminar(producto: Producto){
    this.dialog.open(MensajeSiNoDialogComponent, {
      data:{
        titulo: "Eliminar Producto",
        contenido: "¿Está seguro que desea eliminar " + producto.nombre + "?"
      }
    })
    .afterClosed()
    .subscribe(r =>{
      if(r){
        this._productoService.eliminar(producto.producto_id)
        .subscribe((res: any) =>{
          if(res.error){
            this.dialog.open(MensajePlanoDialogComponent, {
              data:{
                titulo: "Error",
                contenido: "Error al eliminar"
              }
            })
          }
          else{
            this.ngAfterViewInit();
          }
        })
      }
    });
  }

  guardar() {
    if (this.productoForm.valid) {
      this.dialog.open(MensajeEsperaDialogComponent, {
        data: {
          titulo: "Insertando",
          contenido: "Insertando " + this.productoForm.value['nombre']
        },
        disableClose: true
      });
      this._productoService.insertar(new Producto(
        0,
        this.productoForm.value['nombre'],
        this.productoForm.value['codigo_barras'],
        this.productoForm.value['precio_compra'],
        this.productoForm.value['precio_venta'],
        4,
        0
      ))
        .subscribe((r: any) => {
          this.dialog.closeAll();
          if (r.error) {
            var mensaje = "";
            for(var i in r.messages) {
              mensaje += i + ": " + r.messages[i] + "\n";
            }
            console.log("rrorrrrrr");
            this.dialog.open(MensajePlanoDialogComponent, {
              data:{
                titulo: "Error al insertar",
                contenido: mensaje
              }
            })
          }
          else {
            this.dialog.open(MensajePlanoDialogComponent, {
              data: {
                titulo: "Insertado",
                contenido: r.nombre + " se ha insertado correctamente"
              }
            })
            .afterClosed()
            .subscribe(() =>{
              this.ngAfterViewInit();
            });
          }
        });
    }
  }

  curSec: Number = 0;

  startTimer(seconds: number) {
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.curSec = sec;
      if (this.curSec === seconds) {
        sub.unsubscribe();
        //this._router.navigate(['obligaciones/ver', this.estacionId]);
        this.dialog.closeAll();
      }
    });
  }

  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
