import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Renter} from './domains/Renter';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService {

  private grisonskyURL = 'http://localhost:90';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET renters */
getRenters (): Observable<Renter[]> {
  return this.http.get<Renter[]>(this.grisonskyURL+'/renters')
}
}
