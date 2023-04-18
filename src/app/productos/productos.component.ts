import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
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
    this.productoForm.patchValue({ producto_id: null, nombre: null, codigo_barras: null, precio_compra: null, precio_venta: null });

    this._productoService.getAll()
      .subscribe((productos: Producto[]) => {
        this.isLoadingResults = true;
        this.dataSource.data = productos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
      });

  }

  editar(producto: Producto) {
    this.edit = true;
    this.productoForm.patchValue({ producto_id: producto.producto_id, nombre: producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1), codigo_barras: producto.codigo_barras, precio_compra: producto.precio_compra, precio_venta: producto.precio_venta });
  }

  eliminar(producto: Producto) {
    this.dialog.open(MensajeSiNoDialogComponent, {
      data: {
        titulo: "Eliminar Producto",
        contenido: "¿Está seguro que desea eliminar " + producto.nombre + "?"
      }
    })
      .afterClosed()
      .subscribe(r => {
        if (r) {
          this._productoService.eliminar(producto.producto_id)
            .subscribe((res: any) => {
              if (res.error) {
                this.dialog.open(MensajePlanoDialogComponent, {
                  data: {
                    titulo: "Error",
                    contenido: "Error al eliminar"
                  }
                })
              }
              else {
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
          titulo: this.edit ? "Editando" : "Insertando",
          contenido: (this.edit ? "Editando " : "Insertando ") + this.productoForm.value['nombre']
        },
        disableClose: true
      });

      let obs: Observable<Producto> = this.edit ?
        this._productoService.editar(new Producto(
          this.productoForm.value['producto_id'],
          this.productoForm.value['nombre'].toLowerCase(),
          this.productoForm.value['codigo_barras'],
          this.productoForm.value['precio_compra'],
          this.productoForm.value['precio_venta'],
          4,
          0
        )) :
        this._productoService.insertar(new Producto(
          0,
          this.productoForm.value['nombre'].toLowerCase(),
          this.productoForm.value['codigo_barras'],
          this.productoForm.value['precio_compra'],
          this.productoForm.value['precio_venta'],
          4,
          0
        ));

      obs.subscribe((r: any) => {
        this.dialog.closeAll();
        if (r.error) {
          var mensaje = "";
          for (var i in r.messages) {
            mensaje += i + ": " + r.messages[i] + "\n";
          }
          console.log("rrorrrrrr");
          this.dialog.open(MensajePlanoDialogComponent, {
            data: {
              titulo: "Error",
              contenido: mensaje
            }
          })
        }
        else {
          this.dialog.open(MensajePlanoDialogComponent, {
            data: {
              titulo: this.edit ? "Editado" : "Insertado",
              contenido: r.nombre + (this.edit ? " se ha editado correctamente" : " se ha insertado correctamente")
            }
          })
            .afterClosed()
            .subscribe(() => {
              this.edit = false;
              this.ngAfterViewInit();
            });
        }
      });
    }
  }

  cancelar() {
    this.edit = false;
    this.productoForm.patchValue({ producto_id: null, nombre: null, codigo_barras: null, precio_compra: null, precio_venta: null });
  }

  curSec: Number = 0;

  startTimer(seconds: number) {
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.curSec = sec;
      if (this.curSec === seconds) {
        sub.unsubscribe();
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
