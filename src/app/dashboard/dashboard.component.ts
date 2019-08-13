import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Rent } from '../domains/Rent';
import { FormGroup, Validators, FormBuilder }  from '@angular/forms';
import { Client } from '../domains/Client';
import { Period } from '../domains/Period';
import { Renter } from '../domains/Renter';

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
  renters: Renter[];
  renter: Renter;
  appartments: String[];
  
  displayedColumns: string[] = ['Date Entrée', 'Date Sortie', 'Appartement', 'Locataire', 'Téléphone', 'Nombre', 'Ménage', 'Parking', 'Site', 'Prix', 'Commentaires', 'Delete'];
  displayNewRentForm : boolean;
  
  constructor(private dashboardService: DashboardService, fb: FormBuilder) { 
    this.newRentForm = fb.group({
      appartment: ["", Validators.required],
      renter: ["", Validators.required],
      startDate: ["", Validators.required],
      startTime: ["", Validators.required],
      endDate: ["", Validators.required],
      endTime: ["", Validators.required],
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
    localStorage.setItem("user", "jules");
    this.getRents();
    this.getRenter();
  }

  addNewRent() {
    this.displayNewRentForm = true;
  }

  saveNewRent() {
    this.displayNewRentForm = false;
    let rentValue : Rent = this.getRentFromForm(this.newRentForm.value);
    this.dashboardService.saveRent(rentValue).subscribe(data => {
      this.getRents();
    });
  }

  getRentFromForm(form : any) : Rent {
    let rentValue = new Rent();
    let periodValue = new Period();
    let clientValue = new Client();

    //Period values
    periodValue.startDate = new Date(form.startDate);
    periodValue.endDate = new Date(form.endDate);

    //Client values
    clientValue.name = form.client;
    clientValue.phoneNumber = form.phoneNumber;

    //Rent values
    rentValue.client = clientValue;
    rentValue.period = periodValue;
    rentValue.renter = this.renter;
    rentValue.appartment = form.appartment;
    rentValue.cleaning = form.cleaning.toLowerCase() == 'true' ? true : false;
    rentValue.comments = form.comments;
    rentValue.nbClient = form.nbClient;
    rentValue.parking = form.parking.toLowerCase() == 'true' ? true : false;
    rentValue.price = form.price;
    rentValue.site = form.site;
    return rentValue;
  }

  cancelNewRent() : void {
    this.displayNewRentForm = false;
    console.log("Rent cancelled");
  }

  deleteRent(rentId: number) : void {
    this.dashboardService.deleteRent(rentId).subscribe(() => {
      this.getRents();
    });
  }
  getRents(): void {
    this.dashboardService.getRents().subscribe(rents => {
      this.rents = rents});
  }

  getRenter(): void {
    this.dashboardService.getRenter(localStorage.getItem("user")).subscribe(renter => {
      this.renter = renter;
      this.appartments = renter.appartments.split(";");
    });
  }
}
