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
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService,
              DatePipe
             ]
})

export class DashboardComponent implements OnInit {

  newRentForm: FormGroup;
  rents : Rent[];
  rent: Rent;
  renters: Renter[];
  renter: Renter;
  appartments: String[];
  lastModification: Modification;
  rentStartTime: String;
  rentEndTime: String;
  currentYearRents: boolean;
  allRents: boolean;
  futureRents: boolean;
  currentDate: Date;

  dataSource: MatTableDataSource<Rent> = new MatTableDataSource();
  
  displayedColumns: string[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayNewRentForm : boolean;
  displayUpdateRentForm : boolean;
  displayBillCard : boolean;
  displayBillCardAdmin: boolean;
  cleaningChecked : boolean = true;
  parkingChecked : boolean = false;
  displayLastModifMessage : boolean = false;

  constructor(private dashboardService: DashboardService, fb: FormBuilder, public dialog: MatDialog, private datePipe: DatePipe) { 
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
    this.displayUpdateRentForm = false;
    this.displayBillCard = false;
    this.displayBillCardAdmin = false;
    this.currentYearRents = true;
    this.allRents = false;
    this.futureRents = false;
    this.currentDate = new Date();
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
    this.displayUpdateRentForm = false;
    this.displayNewRentForm = true;
  }

  displayUpdateRent(rent : Rent): void {
    this.rent = rent ;
    this.rent.period.startDate = new Date(rent.period.startDate);
    this.rent.period.endDate = new Date(rent.period.endDate);
    this.rentStartTime = this.datePipe.transform(this.rent.period.startDate, 'HH:mm');
    this.rentEndTime = this.datePipe.transform(this.rent.period.endDate, 'HH:mm');
    this.displayBillCard = false;
    this.displayBillCardAdmin = false;
    this.displayNewRentForm = false;
    this.displayUpdateRentForm = true;
  }

  updateRent(rentId: number) {
    this.displayUpdateRentForm = false;
    let rentValue : Rent = this.getRentFromForm(this.newRentForm.value);
    rentValue.id = rentId;
    this.dashboardService.updateRent(rentValue, this.renter.id).subscribe(data => {
      this.getRents(this.renter.id);
      this.getRenter();
    });
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
    periodValue.startDate = new Date(form.startDate);
    periodValue.startDate.setHours(parseInt(form.startTime.split(':')[0]), parseInt(form.startTime.split(':')[1]));
    periodValue.endDate = new Date(form.endDate);
    periodValue.endDate.setHours(parseInt(form.endTime.split(':')[0]), parseInt(form.endTime.split(':')[1]));

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
          this.displayUpdateRentForm = false;
        });
      }
    });
    
  }
  getRents(renterId : number): void {
      this.dashboardService.getRents(renterId).subscribe(rents => {
      this.rents = rents
      this.dataSource = new MatTableDataSource(rents);
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'startDate': return this.datePipe.transform(item.period.startDate, 'dd-MM-yyyy');
          case 'endDate': return this.datePipe.transform(item.period.endDate, 'dd-MM-yyyy');
          case 'startTime': return this.datePipe.transform(item.period.startDate, 'HH:mm');
          case 'endTime': return this.datePipe.transform(item.period.endDate, 'HH:mm');
          case 'renter': return item.renter.name;
          case 'client': return item.client.name;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.getLastModification();
    });
  }

  getAllRents(): void {
    this.currentYearRents = false;
    this.allRents = true;
    this.futureRents = false;
  }
  getYearRents(): void {
    this.currentYearRents = true;
    this.allRents = false;
    this.futureRents = false;
  }

  getFutureRents(): void {
    this.currentYearRents = false;
    this.allRents = false;
    this.futureRents = true;
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
      this.displayedColumns = ['startDate', 'startTime', 'endDate', 'endTime', 'renter', 'appartment', 'client', 'phoneNumber', 'nbClient', 'cleaning', 'parking', 'site', 'price', 'comments', 'Delete'];
    }
    else {
      this.displayedColumns = ['startDate', 'startTime', 'endDate', 'endTime', 'appartment', 'client', 'phoneNumber', 'nbClient', 'cleaning', 'parking', 'site', 'price', 'comments', 'Delete'];
    }
  }

  displayBill(): void {
    this.displayNewRentForm = false;
    this.displayUpdateRentForm = false;
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
    this.dashboardService.payRent(rent, this.renter.id).subscribe(rent => {
      this.getRenter();
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isDisplayed(rent: Rent): boolean{
    let startDate = new Date(rent.period.startDate);
    let endDate = new Date(rent.period.endDate);
    return (this.allRents || (this.futureRents && (startDate.getTime() >= this.currentDate.getTime() || endDate.getTime() >= this.currentDate.getTime()))
            || (this.currentYearRents && (startDate.getFullYear() === this.currentDate.getFullYear() || endDate.getFullYear() === this.currentDate.getFullYear())));
          }
}
