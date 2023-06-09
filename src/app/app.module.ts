import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import localeEsMx from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsMx, 'es');

//Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';

//Terceros
import { NgxEchartsModule } from 'ngx-echarts';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';

import { ProductosComponent } from './productos/productos.component';
import { InicioComponent } from './inicio/inicio.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { CompraVentaComponent } from './compra-venta/compra-venta.component';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';
import { MensajePlanoDialogComponent } from './dialogs/mensaje-plano-dialog/mensaje-plano-dialog.component';
import { MensajeEsperaDialogComponent } from './dialogs/mensaje-espera-dialog/mensaje-espera-dialog.component';
import { MensajeSiNoDialogComponent } from './dialogs/mensaje-si-no-dialog/mensaje-si-no-dialog.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { TicketDialogComponent } from './dialogs/ticket-dialog/ticket-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainToolbarComponent,
    ProductosComponent,
    InicioComponent,
    EstadisticasComponent,
    CompraVentaComponent,
    PuntoVentaComponent,
    MensajePlanoDialogComponent,
    MensajeEsperaDialogComponent,
    MensajeSiNoDialogComponent,
    LoginComponent,
    TicketDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    {
      provide: LOCALE_ID,
      useValue: 'es-Mx'
    },
    {
      provide: DEFAULT_CURRENCY_CODE, 
      useValue: 'MXN'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
