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

  constructor(private _stats: StatisticsService) { }

  ngOnInit() {
  }

}
