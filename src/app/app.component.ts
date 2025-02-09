import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../services/data.service';
import { Schedule } from '../data/schedule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Train } from '../data/train';
import { Station } from '../data/station';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  providers: [DataService],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  stations?: { id: string, data: Station }[];
  from?: string;
  to?: string;
  schedule?: Schedule;
  trains?: Train[];
  holidayTrains?: Set<string>;
  workdayTrains?: Set<string>;
  notFound = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe(schedule => this.showSchedule(schedule));
  }

  search() {
    this.notFound = false;
    if (!this.schedule || !this.from || !this.to || !this.holidayTrains || !this.workdayTrains || this.from === this.to) {
      this.notFound = true;
      return;
    }
    const trains: Train[] = [];
    const now = this.now();
    for (const trainId of Object.keys(this.schedule.trains)) {
      const train = this.schedule.trains[trainId];
      const trainFrom = train[this.from];
      const trainTo = train[this.to];
      if (trainFrom == null || trainTo == null || trainFrom > trainTo) {
        continue;
      }
      let originTime = 10000, destinationTime = 0;
      let originStationId = "", destinationStationId = "";
      for (const stationId of Object.keys(train)) {
        const time = train[stationId];
        if (time < originTime) {
          originTime = time;
          originStationId = stationId;
        }
        if (time > destinationTime) {
          destinationTime = time;
          destinationStationId = stationId;
        }
      }
      trains.push({
        id: trainId,
        from: trainFrom,
        to: trainTo,
        days: this.holidayTrains.has(trainId) ? "holiday"
          : this.workdayTrains.has(trainId) ? "workday" : undefined,
        origin: this.schedule.stations[originStationId],
        destination: this.schedule.stations[destinationStationId],
        late: trainFrom < now,
        duration: this.getDuration(trainFrom, trainTo)
      });
    }
    this.trains = trains.sort((a, b) => a.from - b.from);
    this.notFound = !this.trains[0];
  }

  swap() {
    const tmp = this.from;
    this.from = this.to;
    this.to = tmp;
  }

  private getDuration(from: number, to: number) {
    const minuteDiff = Math.floor(to * 100 % 100 - from * 100 % 100)
    const hourDiff = Math.floor(to) - Math.floor(from);
    const diff = hourDiff * 60 + minuteDiff;
    const minutes = diff % 60;
    const hours = Math.floor(diff / 60);
    let result = `${minutes} minutes`
    if (hours > 0) {
      result = `${hours} ${hours > 1 ? 'hours' : 'hour'} ${result}`
    }
    return result;
  }

  private showSchedule(schedule: Schedule) {
    this.stations = Object.keys(schedule.stations)
      .map(k => ({ id: k, data: schedule.stations[k] }))
      .sort((a, b) => a.data.name.localeCompare(b.data.name));
    this.schedule = schedule;
    this.holidayTrains = new Set(schedule.holidayTrains);
    this.workdayTrains = new Set(schedule.workdayTrains);
  }

  private now() {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Belgrade" }));
    return today.getHours() + today.getMinutes() / 60;
  }
}
