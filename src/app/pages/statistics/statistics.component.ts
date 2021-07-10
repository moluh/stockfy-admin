import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { StatisticsService } from 'src/app/services/statistics.service';
dayjs.extend(utc);
import { ArraysGraphics } from './arraysGraphics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  title: string = 'Estadísticas';
  statisticsDashboard: any = null;
  statisticsGraphic: any = null;
  styleGraphic: string = 'bar';
  fromDashboard: any = dayjs(new Date()).format('YYYY-MM-DD');
  toDashboard: any = dayjs(new Date()).add(1, 'month').format('YYYY-MM-DD');
  fromGraphic: any = dayjs(new Date()).format('YYYY-MM-DD');
  toGraphic: any = dayjs(new Date()).add(1, 'month').format('YYYY-MM-DD');

  // ================================
  // BAR STYLE GRAPHIC
  // ================================
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // LABELS
  lineLabelsCountMovimientos: Label[] = [];
  lineLabelsCountPagos: Label[] = [];
  lineLabelsGanancias: Label[] = [];
  lineLabelsTotalDePagos: Label[] = [];
  lineLabelsTotalVendido: Label[] = [];
  // DATA
  lineDataCountMovimientos: ChartDataSets[] = [];
  lineDataCountPagos: ChartDataSets[] = [];
  lineDataGanancias: ChartDataSets[] = [];
  lineDataTotalDePagos: ChartDataSets[] = [];
  lineDataTotalVendido: ChartDataSets[] = [];

  // ================================
  // BAR STYLE GRAPHIC
  // ================================
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  // LABELS
  barLabelsCountMovimientos: Label[] = [];
  barLabelsCountPagos: Label[] = [];
  barLabelsGanancias: Label[] = [];
  barLabelsTotalDePagos: Label[] = [];
  barLabelsTotalVendido: Label[] = [];
  // DATA
  barDataCountMovimientos: ChartDataSets[] = [];
  barDataCountPagos: ChartDataSets[] = [];
  barDataGanancias: ChartDataSets[] = [];
  barDataTotalDePagos: ChartDataSets[] = [];
  barDataTotalVendido: ChartDataSets[] = [];

  constructor(private _stats: StatisticsService) {}

  ngOnInit(): void {
    // npm i ng2-charts@^2.3.0 chart.js@^2.9.3
    // npm un ng2-charts chart.js
  }

  changeStyleGraphic() {
    this.styleGraphic = this.styleGraphic === 'bar' ? 'line' : 'bar';
  }

  randomHexColor() {
    const random = '#' + Math.floor(Math.random() * 16777215).toString(16);
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
    this.resetData();
    this._stats
      .getBetweenDatesGraphic(this.fromGraphic, this.toGraphic)
      .subscribe((data) => {
        this.setGraphicData(data);
      });
  }

  setGraphicData(data) {
    data.map((stat) => {
      // line labels
      this.lineLabelsCountMovimientos.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.lineLabelsCountPagos.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.lineLabelsGanancias.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.lineLabelsTotalDePagos.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.lineLabelsTotalVendido.push(dayjs(stat.Fecha).format('DD-MMM'));
      // line datos
      this.lineDataCountMovimientos[0].data.push(
        parseInt(stat.CountMovimientos)
      );
      this.lineDataCountPagos[0].data.push(parseInt(stat.CountPagos));
      this.lineDataGanancias[0].data.push(stat.Ganancias);
      this.lineDataTotalDePagos[0].data.push(stat.TotalDePagos);
      this.lineDataTotalVendido[0].data.push(stat.TotalVendido);

      // bar labels
      this.barLabelsCountMovimientos.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.barLabelsCountPagos.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.barLabelsGanancias.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.barLabelsTotalDePagos.push(dayjs(stat.Fecha).format('DD-MMM'));
      this.barLabelsTotalVendido.push(dayjs(stat.Fecha).format('DD-MMM'));
      // bar datos
      this.barDataCountMovimientos[0].data.push(
        parseInt(stat.CountMovimientos)
      );
      this.barDataCountPagos[0].data.push(parseInt(stat.CountPagos));
      this.barDataGanancias[0].data.push(stat.Ganancias);
      this.barDataTotalDePagos[0].data.push(stat.TotalDePagos);
      this.barDataTotalVendido[0].data.push(stat.TotalVendido);
    });
    this.statisticsGraphic = data;
  }

  resetData() {
    // LABELS
    this.lineLabelsCountMovimientos = [];
    this.lineLabelsCountPagos = [];
    this.lineLabelsGanancias = [];
    this.lineLabelsTotalDePagos = [];
    this.lineLabelsTotalVendido = [];
    // DATA
    this.lineDataCountMovimientos = [
      {
        data: [],
        label: 'Cantidad de ventas',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.lineDataCountPagos = [
      {
        data: [],
        label: 'Cantidad de pagos',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.lineDataGanancias = [
      {
        data: [],
        label: 'Ganancias por intereses',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.lineDataTotalDePagos = [
      {
        data: [],
        label: 'Monto total de pagos',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.lineDataTotalVendido = [
      {
        data: [],
        label: 'Monto total vendido',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    // LABELS
    this.barLabelsCountMovimientos = [];
    this.barLabelsCountPagos = [];
    this.barLabelsGanancias = [];
    this.barLabelsTotalDePagos = [];
    this.barLabelsTotalVendido = [];
    // DATA
    this.barDataCountMovimientos = [
      {
        data: [],
        label: 'Cantidad de ventas',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.barDataCountPagos = [
      {
        data: [],
        label: 'Cantidad de ventas',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.barDataGanancias = [
      {
        data: [],
        label: 'Ganancias por intereses',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.barDataTotalDePagos = [
      {
        data: [],
        label: 'Monto total de pagos',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
    this.barDataTotalVendido = [
      {
        data: [],
        label: 'Monto total vendido',
        backgroundColor: this.randomHexColor(),
        hoverBackgroundColor: this.randomHexColor(),
      },
    ];
  }
}
