import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Rent } from './domains/Rent';
import { Observable } from 'rxjs';
import { Renter } from './domains/Renter';
import { Modification } from './domains/Modification';
import { Login } from './domains/Login';

@Injectable()
export class DashboardService {

  private grisonskyURL = 'http://localhost:9090';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET rents */
  getRents(renterId: number): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.grisonskyURL + '/rent/all/'+renterId);
  }

  /** GET rents with date parameters */
  getRentsByDate(renterId: number, date: number) {
    return this.http.get<Rent[]>(this.grisonskyURL + '/rent/'+renterId+'/'+date);
  }

  /** GET rents */
  getFutureRents(renterId: number): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.grisonskyURL + '/rent/future/'+renterId);
  }

  /** GET renter */
  getRenter(name : String): Observable<Renter> {
    return this.http.get<Renter>(this.grisonskyURL + '/renter/'+name);
  }

 /** PUT PAY rent */
 payRent(rent: Rent, userId: number): Observable<Rent> {
  return this.http.put<Rent>(this.grisonskyURL + '/rent/pay/'+userId,rent);
} 

/** PUT Update rent */
updateRent(rent: Rent, userId: number): Observable<Rent> {
  return this.http.put<Rent>(this.grisonskyURL + '/rent/'+userId,rent);
} 

  /** GET renters */
  getRenters(renter : Renter): Observable<Renter[]> {
    return this.http.get<Renter[]>(this.grisonskyURL + '/renter/all/'+renter.id);
  }

  /** GET Last Modification */
  getLastModification(): Observable<Modification> {
    return this.http.get<Modification>(this.grisonskyURL +'/rent/lastmodif');
  }

  /** POST login */
  login(loginValue : Login): Observable<Renter> {
    return this.http.post<Renter>(this.grisonskyURL + '/renter/login', loginValue);
  }

  /** POST rent */
  saveRent(rent: Rent, userId: number): Observable<Rent> {
    return this.http.post<Rent>(this.grisonskyURL + '/rent/save/'+userId, rent)
  }

  /** DELETE rent */
  deleteRent(rentId: number, userId: number): Observable<String> {
    return this.http.delete<any>(this.grisonskyURL + '/rent/'+rentId+'/'+userId);
  }
}
