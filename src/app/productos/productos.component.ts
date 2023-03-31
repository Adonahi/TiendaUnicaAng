import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit{

  productoForm = this._formBuilder.group({
    nombre: ['', Validators.required],
    codigo_barras: [''],
    precio_compra: ['', Validators.required],
    precio_venta: ['', Validators.required]
  });

  constructor(
    private _formBuilder: UntypedFormBuilder
  ){

  }

  ngOnInit(): void {
    
  }

  guardar(){
    //console.log(this.productoForm.value);

  }

}
