import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Rent } from '../domains/Rent';
import { FormGroup, Validators, FormBuilder }  from '@angular/forms';
import { Client } from '../domains/Client';
import { Period } from '../domains/Period';
import { Renter } from '../domains/Renter';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


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

  dataSource: MatTableDataSource<Rent> = new MatTableDataSource();
  
  displayedColumns: string[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayNewRentForm : boolean;
  
  constructor(private dashboardService: DashboardService, fb: FormBuilder, public dialog: MatDialog) { 
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
    this.getRenter();
    this.dataSource.sort = this.sort;

  }

  addNewRent() {
    this.displayNewRentForm = true;
  }

  saveNewRent() {
    this.displayNewRentForm = false;
    let rentValue : Rent = this.getRentFromForm(this.newRentForm.value);
    this.dashboardService.saveRent(rentValue).subscribe(data => {
      this.getRents(this.renter.id);
    });
  }

  getRentFromForm(form : any) : Rent {
    let rentValue = new Rent();
    let periodValue = new Period();
    let clientValue = new Client();

    //Period values
    periodValue.startDate = new Date(form.startDate + ' ' + form.startTime);
    periodValue.endDate = new Date(form.endDate + ' ' + form.endTime);

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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Es-tu sûr de vouloir supprimer cette location ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dashboardService.deleteRent(rentId).subscribe(() => {
          this.getRents(this.renter.id);
        });
      }
    });
    
  }
  getRents(renterId : number): void {
    this.dashboardService.getRents(renterId).subscribe(rents => {
      this.dataSource = new MatTableDataSource(rents);
      this.dataSource.sort = this.sort;
      this.rents = rents});
  }

  getRenter(): void {
    this.dashboardService.getRenter(localStorage.getItem("user")).subscribe(renter => {
      this.renter = renter;
      this.appartments = renter.appartments.split(";");
      this.getDisplayedColumns();
      this.getRents(renter.id);
    });
  }

  getDisplayedColumns(): void {
    if (this.renter.admin == true) {
      this.displayedColumns = ['startDate', 'endDate','renter', 'appartment', 'client', 'phoneNumber', 'nbClient', 'cleaning', 'parking', 'site', 'price', 'comments', 'Delete'];
    }
    else {
      this.displayedColumns = ['startDate', 'endDate', 'appartment', 'client', 'phoneNumber', 'nbClient', 'cleaning', 'parking', 'site', 'price', 'comments', 'Delete'];
    }
  }
}
