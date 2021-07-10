import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { StatisticsService } from 'src/app/services/statistics.service';
dayjs.extend(utc);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  title: string = 'Estadísticas';
  statisticsDashboard: any = null;
  statisticsGraphic: any = null;
  fromDashboard: any = dayjs(new Date()).format('YYYY-MM-DD');
  toDashboard: any = dayjs(new Date()).add(1, 'month').format('YYYY-MM-DD');
  fromGraphic: any = dayjs(new Date()).format('YYYY-MM-DD');
  toGraphic: any = dayjs(new Date()).add(1, 'month').format('YYYY-MM-DD');

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  // LABELS
  labelsCountMovimientos: Label[] = [];
  labelsCountPagos: Label[] = [];
  labelsGanancias: Label[] = [];
  labelsTotalDePagos: Label[] = [];
  labelsTotalVendido: Label[] = [];
  // DATA
  dataCountMovimientos: ChartDataSets[] = [
    {
      data: [],
      label: 'Cantidad de ventas',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  dataCountPagos: ChartDataSets[] = [
    {
      data: [],
      label: 'Cantidad de ventas',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  dataGanancias: ChartDataSets[] = [
    {
      data: [],
      label: 'Ganancias por intereses',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  dataTotalDePagos: ChartDataSets[] = [
    {
      data: [],
      label: 'Monto total de pagos',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  dataTotalVendido: ChartDataSets[] = [
    {
      data: [],
      label: 'Monto total vendido',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];

  constructor(private _stats: StatisticsService) {}

  ngOnInit(): void {
    // npm i ng2-charts@^2.3.0 chart.js@^2.9.3
    // npm un ng2-charts chart.js
  }

  randomHexColor() {
    const random = '#' + Math.floor(Math.random() * 16777215).toString(16)
    return random;
  }

  getStatsDashboard() {
    this._stats
      .getBetweenDatesDashboard(this.fromDashboard, this.toDashboard)
      .subscribe((data) => {
        this.statisticsDashboard = data;
      });
  }

  getStatsGraphics() {
    this.cleanData()
    this._stats
      .getBetweenDatesGraphic(this.fromDashboard, this.toDashboard)
      .subscribe((data) => {
        this.setGraphicData(data);
      });
  }

  setGraphicData(data) {
    data.map((stat) => {
      // labels
      this.labelsCountMovimientos.push(dayjs(stat.Fecha).format('DD-MM-YYYY'));
      this.labelsCountPagos.push(dayjs(stat.Fecha).format('DD-MM-YYYY'));
      this.labelsGanancias.push(dayjs(stat.Fecha).format('DD-MM-YYYY'));
      this.labelsTotalDePagos.push(dayjs(stat.Fecha).format('DD-MM-YYYY'));
      this.labelsTotalVendido.push(dayjs(stat.Fecha).format('DD-MM-YYYY'));
      // datos
      this.dataCountMovimientos[0].data.push(parseInt(stat.CountMovimientos));
      this.dataCountPagos[0].data.push(parseInt(stat.CountPagos));
      this.dataGanancias[0].data.push(stat.Ganancias);
      this.dataTotalDePagos[0].data.push(stat.TotalDePagos);
      this.dataTotalVendido[0].data.push(stat.TotalVendido);
    });
    this.statisticsGraphic = data;
  }

  cleanData() {
     // LABELS
  this.labelsCountMovimientos = []
  this.labelsCountPagos = []
  this.labelsGanancias = []
  this.labelsTotalDePagos = []
  this.labelsTotalVendido = []
  // DATA
  this.dataCountMovimientos  = [
    {
      data: [],
      label: 'Cantidad de ventas',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  this.dataCountPagos = [
    {
      data: [],
      label: 'Cantidad de ventas',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  this.dataGanancias = [
    {
      data: [],
      label: 'Ganancias por intereses',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  this.dataTotalDePagos = [
    {
      data: [],
      label: 'Monto total de pagos',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  this.dataTotalVendido = [
    {
      data: [],
      label: 'Monto total vendido',
      backgroundColor: this.randomHexColor(),
      hoverBackgroundColor: this.randomHexColor(),
    },
  ];
  }
}
