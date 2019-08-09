import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Rent } from './domains/Rent';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {

  private grisonskyURL = 'http://localhost:90';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET rents */
getRents (): Observable<Rent[]> {
  return this.http.get<Rent[]>(this.grisonskyURL+'/rent/all')
}

/** POST rent */
saveRent (rent: Rent): Observable<Rent> {
  return this.http.post<Rent>(this.grisonskyURL+'/rent/save', rent)
}
}
