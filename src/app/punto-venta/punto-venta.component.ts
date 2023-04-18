import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Producto } from '../classes/producto.class';
import { ProductoService } from '../services/producto.service';
import { Observable, map, startWith, ReplaySubject } from 'rxjs'
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html'
})
export class PuntoVentaComponent implements OnInit {

  error = false;
  productosSeleccionados: any[] = [];
  productos: Producto[] = [];
  filteredOptions: Observable<Producto[]>;

  displayedColumns: string[] = [
    'producto',
    'precio_venta',
    'cantidad',
    'total_row',
    'quitar'
  ];
  dataSource = new ProductoDataSource(this.productosSeleccionados);

  ventaForm = this._formBuilder.group({
    nombre_producto: [''],
    codigo_barras: ['']
  });

  constructor(private _formBuilder: UntypedFormBuilder,
    private _productoService: ProductoService) { }

  ngOnInit(): void {
    this._productoService.getAll()
      .subscribe(r => {
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
    console.log(this.productosSeleccionados);
    if (this.productosSeleccionados[i].cantidad < 1) {
      this.productosSeleccionados[i].cantidad = 1;
    }
    this.productosSeleccionados[i].precio = this.productosSeleccionados[i].cantidad * this.productosSeleccionados[i].precio_venta;
  }

  buscarPorCodigo() {
    let productoVenta = {
      nombre: '',
      precio_venta: 0,
      producto_id: 0,
      cantidad: 0,
      precio: 0
    };
    this.productos.every(producto => {
      if (producto.codigo_barras == this.ventaForm.value['codigo_barras']) {
        productoVenta.nombre = producto.nombre;
        productoVenta.precio_venta = Number(producto.precio_venta);
        productoVenta.producto_id = Number(producto.producto_id);
        productoVenta.cantidad = 1;
        productoVenta.precio = Number(producto.precio_venta);
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
            this.productosSeleccionados[index].precio = this.productosSeleccionados[index].precio_venta * this.productosSeleccionados[index].cantidad;
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
      producto_id: Number(producto.producto_id),
      cantidad: 1,
      precio: Number(producto.precio_venta)
    };
    let ban = false;
    if (this.productosSeleccionados.length > 0) {
      for (let index = 0; index < this.productosSeleccionados.length; index++) {
        if (productoVenta.producto_id == this.productosSeleccionados[index].producto_id) {
          this.productosSeleccionados[index].cantidad++;
          this.productosSeleccionados[index].precio = this.productosSeleccionados[index].precio_venta * this.productosSeleccionados[index].cantidad;
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

  getTotalCost() {
    return this.productosSeleccionados.map(t => Number(t.precio)).reduce((acc, value) => acc + value, 0);
  }

  quitar(index: number) {
    this.productosSeleccionados.splice(index, 1);
    this.dataSource.setData(this.productosSeleccionados);
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
