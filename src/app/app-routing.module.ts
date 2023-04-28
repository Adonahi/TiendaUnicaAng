import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompraVentaComponent } from './compra-venta/compra-venta.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { UsuarioGuard } from './guards/usuario.guard';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { ProductosComponent } from './productos/productos.component';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';

const routes: Routes = [
  { path: '',
    component: InicioComponent
  },
  { path: 'punto_venta',
    component: PuntoVentaComponent,
    canActivate: [UsuarioGuard],
    data: {
      role: ['0']
    }
  },
  { path: 'punto_compra',
    component: PuntoVentaComponent,
    canActivate: [UsuarioGuard],
    data: {
      role: ['1']
    }
  },
  { path: 'productos',
    component: ProductosComponent,
    canActivate: [UsuarioGuard],
    data: {
      role: ['1']
    }
  },
  { path: 'estadisticas',
    component: EstadisticasComponent,
    canActivate: [UsuarioGuard],
    data: {
      role: ['1']
    }
  },
  { path: 'compras',
    component: CompraVentaComponent,
    canActivate: [UsuarioGuard],
    data: {
      role: ['1']
    }
  },
  { path: 'ventas',
    component: CompraVentaComponent,
    canActivate: [UsuarioGuard],
    data: {
      role: ['1']
    }
  },
  { path: 'login',
    component: LoginComponent,
    canActivate: [UsuarioGuard]
  },
  {
    path: '**',
    component: InicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
