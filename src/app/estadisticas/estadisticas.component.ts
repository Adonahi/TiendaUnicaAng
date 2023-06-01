import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CompraService } from '../services/compra.service';
import { VentaService } from '../services/venta.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html'
})
export class EstadisticasComponent implements OnInit {

  ventas: any[] = [];
  compras: any[] = [];
  ventasFiltro: any[] = [];
  comprasFiltro: any[] = [];

  ventasGananciasChartOptions: any = {};
  ventasSemana = [0, 0, 0, 0, 0, 0, 0];
  gananciasSemana = [0, 0, 0, 0, 0, 0, 0];
  todayGanancias = new Date();

  ventasPorProductoChartOptions: any = {}
  ventaTotalPorProducto: any[] = [];
  todayVentasPorProducto = new Date();

  ventasVsComprasChartOptions: any = {};
  porcentajeVentas: number = 0;
  porcentajeCompras: number = 0;
  todayVentasVsCompras = new Date();

  constructor(
    private _authService: AuthService,
    private _ventaService: VentaService,
    private _compraService: CompraService,
    private datePipe: DatePipe
  ) {
    combineLatest([
      this._ventaService.getVentaProductoPorUsuario(this._authService.usuario.usuario_id), 
      this._compraService.getCompraProductoPorUsuario(this._authService.usuario.usuario_id)
    ])
      .subscribe(([productosVenta, productosCompra]) => {
        this.ventas = this.ventasFiltro = productosVenta;
        this.compras = this.comprasFiltro = productosCompra;

        //Ventas-Ganancias
        this.ventasGananciasChart(0);

        //Ventas por producto
        this.ventasPorProductoChart(0);

        //Ventas vs Compras
        this.ventasVsComprasChart(0);
      });
  }

  ngOnInit(): void {
  }

  ventasGananciasChart(semana: number) {
    let todayTemp = new Date(this.todayGanancias);
    if(semana != 0){
      this.todayGanancias = new Date(semana == 7 ? this.todayGanancias.getTime() + 604800000 : this.todayGanancias.getTime() - 604800000);
      todayTemp = new Date(this.todayGanancias);
    }
    let first = (this.todayGanancias.getDate() - this.todayGanancias.getDay()) + 1;

    let firstDay = new Date(this.todayGanancias.setDate(first));
    let lastDay = new Date(firstDay.getTime() + 518400000);

    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);

    this.ventasSemana = [0, 0, 0, 0, 0, 0, 0];
    this.gananciasSemana = [0, 0, 0, 0, 0, 0, 0];

    this.ventas.forEach(venta => {
      let fecha = new Date(venta.fecha);
      if (fecha.getTime() >= firstDay.getTime() && fecha.getTime() <= lastDay.getTime()) {
        this.ventasSemana[fecha.getDay() - 1 < 0 ? 6 : fecha.getDay() - 1] += (Number(venta.precio_venta) * Number(venta.cantidad));
        this.gananciasSemana[fecha.getDay() - 1 < 0 ? 6 : fecha.getDay() - 1] += ((Number(venta.precio_venta) * Number(venta.cantidad)) - (Number(venta.precio_compra) * Number(venta.cantidad)));
      }
    });
    this.ventasGananciasChartOptions = {
      title: {
        text: 'Relación de ventas con ganancias',
        subtext: 'Semana del ' + this.datePipe.transform(firstDay, 'fullDate') + ' al ' + this.datePipe.transform(lastDay, 'fullDate')
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        top: '18%',
        data: ['Ventas', 'Ganancias']
      },
      grid: {
        top: '30%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Ventas',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: this.ventasSemana
        },
        {
          name: 'Ganancias',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: this.gananciasSemana
        }
      ]
    }
    this.todayGanancias = new Date(todayTemp);
  }

  ventasPorProductoChart(semana: number){
    
    let todayTemp = new Date(this.todayVentasPorProducto);
    if(semana != 0){
      this.todayVentasPorProducto = new Date(semana == 7 ? this.todayVentasPorProducto.getTime() + 604800000 : this.todayVentasPorProducto.getTime() - 604800000);
      todayTemp = new Date(this.todayVentasPorProducto);
    }
    let first = (this.todayVentasPorProducto.getDate() - this.todayVentasPorProducto.getDay()) + 1;

    let firstDay = new Date(this.todayVentasPorProducto.setDate(first));
    let lastDay = new Date(firstDay.getTime() + 518400000)

    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);

    let ventaPorProducto: number[] = [];
    let ventaPorProductoObj: any[] = [];
    
    this.ventas.forEach(venta =>{
      let fecha = new Date(venta.fecha);
      if (fecha.getTime() >= firstDay.getTime() && fecha.getTime() <= lastDay.getTime()) {
        ventaPorProducto[venta.nombre] = ventaPorProducto[venta.nombre] ? Number(ventaPorProducto[venta.nombre]) + Number(venta.cantidad) : Number(venta.cantidad);
      }
    })

    for(var nombre in ventaPorProducto){
      ventaPorProductoObj.push({value: ventaPorProducto[nombre], name: nombre.charAt(0).toUpperCase() + nombre.slice(1)});
    }

    this.ventasPorProductoChartOptions = {
      title: {
        text: 'Ventas por producto',
        subtext: 'Semana del ' + this.datePipe.transform(firstDay, 'fullDate') + ' al ' + this.datePipe.transform(lastDay, 'fullDate')
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Ventas Por Producto',
          top: '10%',
          type: 'pie',
          radius: ['55%', '90%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: ventaPorProductoObj
        }
      ]
    };
    this.todayVentasPorProducto = new Date(todayTemp);
  }

  ventasVsComprasChart(semana: number){
    let todayTemp = new Date(this.todayVentasVsCompras);
    if(semana != 0){
      this.todayVentasVsCompras = new Date(semana == 7 ? this.todayVentasVsCompras.getTime() + 604800000 : this.todayVentasVsCompras.getTime() - 604800000);
      todayTemp = new Date(this.todayVentasVsCompras);
    }
    let first = (this.todayVentasVsCompras.getDate() - this.todayVentasVsCompras.getDay()) + 1;

    let firstDay = new Date(this.todayVentasVsCompras.setDate(first));
    let lastDay = new Date(firstDay.getTime() + 518400000)

    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);

    let ventasSemana: any[] = [];
    let comprasSemana: any[] = [];

    this.ventas.forEach(venta =>{
      let fecha = new Date(venta.fecha);
      if (fecha.getTime() >= firstDay.getTime() && fecha.getTime() <= lastDay.getTime()) {
        ventasSemana.push(venta);
      }
    });

    this.compras.forEach(compra =>{
      let fecha = new Date(compra.fecha);
      if (fecha.getTime() >= firstDay.getTime() && fecha.getTime() <= lastDay.getTime()) {
        comprasSemana.push(compra);
      }
    });

    this.porcentajeVentas = Number(((this.getTotalPrecio(ventasSemana) / (this.getTotalPrecio(ventasSemana) + this.getTotalPrecio(comprasSemana))) * 100).toFixed(2));
    this.porcentajeCompras = Number(((this.getTotalPrecio(comprasSemana) / (this.getTotalPrecio(ventasSemana) + this.getTotalPrecio(comprasSemana))) * 100).toFixed(2));

    this.ventasVsComprasChartOptions = {
      title: {
        text: 'Ventas contra Compras',
        subtext: 'Semana del ' + this.datePipe.transform(firstDay, 'fullDate') + ' al ' + this.datePipe.transform(lastDay, 'fullDate')
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Ventas contra Compras',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          // adjust the start angle
          startAngle: 180,
          label: {
            show: true,
            formatter(param: any) {
              // correct the percentage
              return param.name + ' (' + param.percent! * 2 + '%)';
            }
          },
          data: ventasSemana.length == 0 && comprasSemana.length == 0 ? [] : [
            { value: this.getTotalPrecio(ventasSemana), name: 'Ventas' },
            { value: this.getTotalPrecio(comprasSemana), name: 'Compras' },
            {
              // make an record to fill the bottom 50%
              value: this.getTotalPrecio(ventasSemana) + this.getTotalPrecio(comprasSemana),
              itemStyle: {
                // stop the chart from rendering this piece
                color: 'none',
                decal: {
                  symbol: 'none'
                }
              },
              label: {
                show: false
              }
            }
          ]
        }
      ]
    };
    this.todayVentasVsCompras = new Date(todayTemp);
  }

  getTotal(data: any[]) {
    return data.map(t => t).reduce((acc, value) => acc + value, 0);
  }

  getTotalPrecio(data: any[]) {
    return data.map(t => Number(t.precio)).reduce((acc, value) => acc + value, 0);
  }

}
