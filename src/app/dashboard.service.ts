import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Renter} from './domains/Renter';
import { Observable } from 'rxjs/Observable';
import { Rent } from './domains/Rent';

@Injectable()
export class DashboardService {

  private grisonskyURL = 'http://localhost:90';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET rents */
getRents (): Observable<Rent[]> {
  return this.http.get<Rent[]>(this.grisonskyURL+'/rent/all')
}
}
