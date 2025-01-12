import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from '../data/schedule';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  constructor(private httpClient: HttpClient) { }

  getData(): Observable<Schedule> {
    return this.httpClient.get<Schedule>('/train-data.json');
  }
}
