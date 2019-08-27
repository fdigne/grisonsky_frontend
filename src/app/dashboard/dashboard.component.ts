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
import { Modification } from '../domains/Modification';


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
  lastModification: Modification;

  dataSource: MatTableDataSource<Rent> = new MatTableDataSource();
  
  displayedColumns: string[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayNewRentForm : boolean;
  displayBillCard : boolean;
  displayBillCardAdmin: boolean;
  cleaningChecked : boolean = true;
  parkingChecked : boolean = false;
  displayLastModifMessage : boolean = false;

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
    this.displayBillCard = false;
    this.displayBillCardAdmin = false;
    this.getRenter();
    this.dataSource.sort = this.sort;
  }
  getLastModification() {
    this.dashboardService.getLastModification().subscribe(modification => {
      modification.date = new Date(modification.date);
      this.lastModification = modification;
    });
  }

  addNewRent() {
    this.displayBillCard = false;
    this.displayBillCardAdmin = false;
    this.displayNewRentForm = true;
  }

  saveNewRent() {
    this.displayNewRentForm = false;
    let rentValue : Rent = this.getRentFromForm(this.newRentForm.value);
    this.dashboardService.saveRent(rentValue, this.renter.id).subscribe(data => {
      this.getRents(this.renter.id);
      this.getRenter();
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
    rentValue.cleaning = form.cleaning;
    rentValue.comments = form.comments;
    rentValue.nbClient = form.nbClient;
    rentValue.parking = form.parking;
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
        this.dashboardService.deleteRent(rentId, this.renter.id).subscribe(() => {
          this.getRents(this.renter.id);
          this.getRenter();
          this.displayBillCard = false;
          this.displayNewRentForm = false;
        });
      }
    });
    
  }
  getRents(renterId : number): void {
    this.dashboardService.getRents(renterId).subscribe(rents => {
      this.dataSource = new MatTableDataSource(rents);
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'startDate': return new Date(item.period.startDate);
          case 'endDate': return new Date(item.period.endDate);
          case 'renter': return item.renter.name;
          case 'client': return item.client.name;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.rents = rents
      this.getLastModification();
    });
  }

  getRenter(): void {
    this.dashboardService.getRenter(localStorage.getItem("user")).subscribe(renter => {
      this.renter = renter;
      this.displayLastModifMessage = renter.admin;
      this.appartments = renter.appartments.split(";");
      this.getDisplayedColumns();
      this.getRents(renter.id);
      if (renter.admin == true) {
        this.dashboardService.getRenters(renter).subscribe(renters => {
          this.renters = renters;
        });
      }
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

  displayBill(): void {
    this.displayNewRentForm = false;
    if (this.renter.admin == true) {
      this.displayBillCard = false;
      this.displayBillCardAdmin = true;
    }
    else {
      this.displayBillCard = true;
      this.displayBillCardAdmin = false;
    }
  }

  payRent(rent: Rent): void {
    this.dashboardService.payRent(rent).subscribe(rent => {
      this.getRenter();
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
