import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from '../data/schedule';
import { map, Observable, shareReplay } from 'rxjs';
import { ScheduleData } from '../data/schedule-data';

@Injectable()
export class DataService {
  private scheduleData?: Observable<ScheduleData>;

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<ScheduleData> {
    return this.scheduleData ??= this.httpClient.get<Schedule>('train-data.json?v=1').pipe(
      map(schedule => ({
        stations: Object.keys(schedule.stations)
          .map(k => ({ id: k, data: schedule.stations[k] }))
          .sort((a, b) => a.data.name.localeCompare(b.data.name)),
        schedule: schedule  ,
        holidayTrains: new Set(schedule.holidayTrains),
        workdayTrains: new Set(schedule.workdayTrains),
        holidays: schedule.holidays
      })),
      shareReplay());
  }
}
