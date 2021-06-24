import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { icons } from 'src/assets/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  icons = icons;
  statistics: any[] = []

  constructor(private _stats: StatisticsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.setStatistics()
    }, 2500);
  }

  setStatistics() {
    this.statistics = [
      {
        section: 1,
        period: "Semana",
        data: [
          {
            title: "Ventas",
            value: 322352,
            type: "money"
          },
          {
            title: "Gastos",
            value: 45323,
            type: "money"
          },
          {
            title: "Artículos",
            value: 354,
            type: "count"
          },
          {
            title: "Nuevos Clientes",
            value: 19,
            type: "count"
          }
        ]
      },
      {
        section: 2,
        period: "Mes",
        data: [
          {
            title: "Ventas",
            value: 56423,
            type: "money"
          },
          {
            title: "Gastos",
            value: 74545,
            type: "money"
          },
          {
            title: "Artículos",
            value: 6455,
            type: "count"
          },
          {
            title: "Nuevos Clientes",
            value: 30,
            type: "count"
          }
        ]
      },
      {
        section: 3,
        period: "Año",
        data: [
          {
            title: "Ventas",
            value: 745.684,
            type: "money"
          },
          {
            title: "Gastos",
            value: 343255,
            type: "money"
          },
          {
            title: "Artículos",
            value: 12984,
            type: "count"
          },
          {
            title: "Nuevos Clientes",
            value: 343,
            type: "count"
          }
        ]
      }
    ]
  }

}
