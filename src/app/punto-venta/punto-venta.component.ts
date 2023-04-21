import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Producto } from '../classes/producto.class';
import { ProductoService } from '../services/producto.service';
import { Observable, map, startWith, ReplaySubject } from 'rxjs'
import { DataSource } from '@angular/cdk/collections';
import { VentaService } from '../services/venta.service';
import { MatDialog } from '@angular/material/dialog';
import { MensajeEsperaDialogComponent } from '../dialogs/mensaje-espera-dialog/mensaje-espera-dialog.component';
import { MensajePlanoDialogComponent } from '../dialogs/mensaje-plano-dialog/mensaje-plano-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CompraService } from '../services/compra.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html'
})
export class PuntoVentaComponent implements OnInit {

  compra = false;
  error = false;
  productosSeleccionados: any[] = [];
  productos: Producto[] = [];
  filteredOptions: Observable<Producto[]>;

  displayedColumns: string[] = [
    'producto',
    'precio_unitario',
    'cantidad',
    'total_row',
    'quitar'
  ];
  dataSource = new ProductoDataSource(this.productosSeleccionados);

  ventaForm = this._formBuilder.group({
    nombre_producto: [''],
    codigo_barras: ['']
  });

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private _authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private _formBuilder: UntypedFormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _compraService: CompraService) {
    this.compra = this._router.url == '/punto_compra';
  }

  ngOnInit(): void {
    let obs = this.compra ?
      this._productoService.getPorUsuario(this._authService.usuario.usuario_id) :
      this._productoService.getAll();

    obs.subscribe(r => {
      this.productos = r;
      this.filteredOptions = this.ventaForm.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = value ? value.nombre_producto.length >= 1 ? value.nombre_producto : null : null;
          return name ? this._filter(name as string) : [];
        })
      )
    });
  }

  cambiarCantidad(i: number) {
    if (this.productosSeleccionados[i].cantidad < 1) {
      this.productosSeleccionados[i].cantidad = 1;
    }
    this.productosSeleccionados[i].precio = this.compra ?
      this.productosSeleccionados[i].cantidad * this.productosSeleccionados[i].precio_compra :
      this.productosSeleccionados[i].cantidad * this.productosSeleccionados[i].precio_venta;
  }

  buscarPorCodigo() {
    let productoVenta = {
      nombre: '',
      precio_venta: 0,
      precio_compra: 0,
      producto_id: 0,
      cantidad: 0,
      precio: 0
    };
    this.productos.every(producto => {
      if (producto.codigo_barras == this.ventaForm.value['codigo_barras']) {
        productoVenta.nombre = producto.nombre;
        productoVenta.precio_venta = Number(producto.precio_venta);
        productoVenta.precio_compra = Number(producto.precio_compra);
        productoVenta.producto_id = Number(producto.producto_id);
        productoVenta.cantidad = 1;
        productoVenta.precio = Number(this.compra ? producto.precio_compra : producto.precio_venta);
        return false;
      }
      return true;
    });
    if (productoVenta.cantidad == 0) {
      this.error = true;
    }
    else {
      this.error = false;
      let ban = false;
      if (this.productosSeleccionados.length > 0) {
        for (let index = 0; index < this.productosSeleccionados.length; index++) {
          if (productoVenta.producto_id == this.productosSeleccionados[index].producto_id) {
            this.productosSeleccionados[index].cantidad++;
            this.productosSeleccionados[index].precio = this.compra ?
              this.productosSeleccionados[index].precio_compra * this.productosSeleccionados[index].cantidad :
              this.productosSeleccionados[index].precio_venta * this.productosSeleccionados[index].cantidad;
            ban = true;
            break;
          }
        }
        if (!ban) this.productosSeleccionados.push(productoVenta);
      }
      else {
        this.productosSeleccionados.push(productoVenta);
      }
      this.dataSource.setData(this.productosSeleccionados);
    }
    this.ventaForm.patchValue({ nombre_producto: '', codigo_barras: '' });
  }

  seleccionar(producto: Producto) {
    this.ventaForm.patchValue({ nombre_producto: '', codigo_barras: '' });
    console.log(producto);
    let productoVenta = {
      nombre: producto.nombre,
      precio_venta: Number(producto.precio_venta),
      precio_compra: Number(producto.precio_compra),
      producto_id: Number(producto.producto_id),
      cantidad: 1,
      precio: Number(this.compra ? producto.precio_compra : producto.precio_venta)
    };
    let ban = false;
    if (this.productosSeleccionados.length > 0) {
      for (let index = 0; index < this.productosSeleccionados.length; index++) {
        if (productoVenta.producto_id == this.productosSeleccionados[index].producto_id) {
          this.productosSeleccionados[index].cantidad++;
          this.productosSeleccionados[index].precio = this.compra ?
            this.productosSeleccionados[index].precio_compra * this.productosSeleccionados[index].cantidad :
            this.productosSeleccionados[index].precio_venta * this.productosSeleccionados[index].cantidad;
          ban = true;
          break;
        }
      }
      if (!ban) this.productosSeleccionados.push(productoVenta);
    }
    else {
      this.productosSeleccionados.push(productoVenta);
    }
    console.log(this.productosSeleccionados);
    this.dataSource.setData(this.productosSeleccionados);
  }

  getTotalCost() {
    return this.productosSeleccionados.map(t => Number(t.precio)).reduce((acc, value) => acc + value, 0);
  }

  quitar(index: number) {
    this.productosSeleccionados.splice(index, 1);
    this.dataSource.setData(this.productosSeleccionados);
  }

  terminarCompra() {
    this.dialog.open(MensajeEsperaDialogComponent, {
      data: {
        titulo: "Procesando",
        contenido: "Procesanding..."
      },
      disableClose: true
    });
    console.log(this.productosSeleccionados);
    let venta = {
      precio_total: this.getTotalCost()
    };
    let obs = this.compra ?
      this._compraService.guardarCompra(venta) :
      this._ventaService.guardarVenta(venta);

    obs.subscribe(id => {
      console.log(id);
      this.productosSeleccionados.forEach(producto => {
        let ventaProducto = {
          venta_fk: id,
          compra_fk: id,
          producto_fk: producto.producto_id,
          cantidad: producto.cantidad,
          precio: producto.precio
        };
        let obs2 = this.compra ?
          this._compraService.guardarCompraProducto(ventaProducto) :
          this._ventaService.guardarVentaProducto(ventaProducto);
        obs2.subscribe();
      });
      this.dialog.closeAll();
      this.dialog.open(MensajePlanoDialogComponent, {
        data: {
          titulo: this.compra ? "Compra registrada (:" : "Venta terminada. Gracias :)",
          contenido: this.compra ? "Ahora a esperar a vender algo" : "Su total a pagar es de: " + this.currencyPipe.transform(venta.precio_total) + ". Depositar en el botecito xfa"
        }
      })
        .afterClosed()
        .subscribe(() => {
          this.productosSeleccionados = [];
        })
    });
  }

  displayFn(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1) : '';
  }

  private _filter(name: string): Producto[] {
    const filterValue = name.toLowerCase();
    return this.productos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
}

class ProductoDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: any[]) {
    this._dataStream.next(data);
  }
}
