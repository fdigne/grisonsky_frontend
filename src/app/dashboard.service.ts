import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Rent } from './domains/Rent';
import { Observable } from 'rxjs';
import { Renter } from './domains/Renter';

@Injectable()
export class DashboardService {

  private grisonskyURL = 'http://localhost:90';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET rents */
  getRents(): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.grisonskyURL + '/rent/all')
  }

  /** GET renter */
  getRenter(name : String): Observable<Renter> {
    return this.http.get<Renter>(this.grisonskyURL + '/renter/'+name);
  }

  /** POST rent */
  saveRent(rent: Rent): Observable<Rent> {
    return this.http.post<Rent>(this.grisonskyURL + '/rent/save', rent)
  }

  /** DELETE rent */
  deleteRent(rentId: number): Observable<String> {
    return this.http.delete<any>(this.grisonskyURL + '/rent/'+rentId);
  }
}
