import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompraVentaComponent } from './compra-venta/compra-venta.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProductosComponent } from './productos/productos.component';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';

const routes: Routes = [
  { path: '',
    component: InicioComponent
  },
  { path: 'punto_venta',
    component: PuntoVentaComponent
  },
  { path: 'productos',
    component: ProductosComponent
  },
  { path: 'estadisticas',
    component: EstadisticasComponent
  },
  { path: 'compras',
    component: CompraVentaComponent
  },
  { path: 'ventas',
    component: CompraVentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
