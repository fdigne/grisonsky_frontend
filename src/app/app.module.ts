import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatDateFormats, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LoginComponent } from './login/login.component';
import {MatGridListModule} from '@angular/material/grid-list';

export const MY_FORMAT: MatDateFormats = {
  parse: {
  dateInput: 'DD/MM/YYYY',
  },
  display: {
  dateInput: 'DD/MM/YYYY',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'DD/MM/YYYY',
  monthYearA11yLabel: 'MMMM YYYY',
  },
  };

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ConfirmationDialogComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    MatSortModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatGridListModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
{ provide: MAT_DATE_FORMATS, useValue: MY_FORMAT }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
