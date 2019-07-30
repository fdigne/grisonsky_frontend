import { Component, OnInit } from '@angular/core';
import { Renter } from '../domains/Renter';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  renters : Renter[];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getRenters();
  }

  getRenters(): void {
    this.dashboardService.getRenters().subscribe(renters => this.renters = renters);
  }

}
