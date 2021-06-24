import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  title: string = "Estadísticas";

  
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Jeanes', 'Remeras', 'Polleras', 'Vestidos', 'Buzos', 'Shorts'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Ventas mensual' }
  ];


  doughnutChartLabels: Label[] = ['Jeanes', 'Remeras', 'Polleras', 'Vestidos', 'Buzos', 'Shorts'];
  doughnutChartData: MultiDataSet = [
    [45, 37, 60, 70, 46, 33]
  ];
  doughnutChartType: ChartType = 'doughnut';

  
  constructor() { }

  ngOnInit(): void {
    // npm i ng2-charts@^2.3.0 chart.js@^2.9.3
    // npm un ng2-charts chart.js
  }

}
