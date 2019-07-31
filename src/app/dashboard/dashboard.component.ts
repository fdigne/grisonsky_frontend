import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Rent } from '../domains/Rent';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Client } from '../domains/Client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit {

  rents : Rent[];
  displayedColumns: string[] = ['Loueur', 'Appartement', 'Date entrée', 'Date sortie', 'Locataire', 'Téléphone', 'Nombre', 'Ménage', 'Site', 'Prix', 'Commentaires'];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getRents();
  }

  getRents(): void {
    this.dashboardService.getRents().subscribe(rents => {
      console.log(rents);
      this.rents = rents});
  }

}
