import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Rent } from '../domains/Rent';
import { FormGroup, Validators, FormBuilder }  from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})

export class DashboardComponent implements OnInit {

  newRentForm: FormGroup;
  rents : Rent[];
  rent: Rent;
  
  displayedColumns: string[] = ['Loueur', 'Appartement', 'Date Entrée', 'Date Sortie', 'Locataire', 'Téléphone', 'Nombre', 'Ménage', 'Parking', 'Site', 'Prix', 'Commentaires'];
  displayNewRentForm : boolean;
  
  constructor(private dashboardService: DashboardService, fb: FormBuilder) { 
    this.newRentForm = fb.group({
      appartment: ["", Validators.required],
      renter: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      client: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      nbClient: ["", Validators.required],
      cleaning: ["", Validators.required],
      parking: ["", Validators.required],
      site: ["", Validators.required],
      price: ["", Validators.required],
      comments: ["", Validators.required]
  });
  }

  ngOnInit() {
    this.displayNewRentForm = false;
    this.getRents();
  }

  addNewRent() {
    console.log("Add new rent");
    this.displayNewRentForm = true;
  }

  saveNewRent() {
    this.displayNewRentForm = false;
    console.log(this.newRentForm.value);
    this.rent = this.newRentForm.value;
    this.dashboardService.saveRent(this.rent);
  }

  cancelNewRent() {
    this.displayNewRentForm = false;
    console.log("Rent cancelled");
  }

  getRents(): void {
    this.dashboardService.getRents().subscribe(rents => {
      this.rents = rents});
  }
}
