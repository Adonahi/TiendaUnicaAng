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
export class PuntoVentaComponent implements OnInit{

  productosSeleccionados: Producto[] = [];
  productos: Producto[] = [];
  filteredOptions: Observable<Producto[]>;

  displayedColumns: string[] = [
    'producto',
    'precio_venta',
    'cantidad',
    'total_row'
  ];
  dataSource = new ProductoDataSource(this.productosSeleccionados);

  ventaForm = this._formBuilder.group({
    nombre_producto: ['', Validators.required]
  });

  constructor(private _formBuilder: UntypedFormBuilder,
              private _productoService: ProductoService){}

  ngOnInit(): void {
    this._productoService.getAll()
    .subscribe(r => {
      this.productos = r;
      this.filteredOptions = this.ventaForm.valueChanges.pipe(
        startWith(''),
        map(value =>{
          const name = value ? value.nombre_producto.length >= 1 ? value.nombre_producto : null : null;
          return name ? this._filter(name as string) : [];
        })
      )
    });
  }
  
  
  seleccionar(producto: Producto){
    console.log(producto);
    this.productosSeleccionados.push(producto);
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

class ProductoDataSource extends DataSource<Producto> {
  private _dataStream = new ReplaySubject<Producto[]>();

  constructor(initialData: Producto[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Producto[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Producto[]) {
    this._dataStream.next(data);
  }
}
