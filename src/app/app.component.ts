import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../services/data.service';
import { Schedule } from '../data/schedule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  providers: [DataService],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  stations?: { id: string, name: string }[];
  from?: string;
  to?: string;
  schedule?: Schedule;
  trains?: { id: string, from: number, to: number, days?: string, destination: string, late: boolean }[];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe(schedule => this.showSchedule(schedule));
  }

  search() {
    if (!this.schedule || !this.from || !this.to) {
      return;
    }
    const trains = [];
    const now = this.now();
    for (const trainId of Object.keys(this.schedule.trains)) {
      const train = this.schedule.trains[trainId];
      const trainFrom = train[this.from];
      const trainTo = train[this.to];
      if (trainFrom == null || trainTo == null || trainFrom > trainTo) {
        continue;
      }
      trains.push({
        id: trainId, from: trainFrom, to: trainTo,
        days: this.schedule.holidayTrains.includes(trainId) ? "holiday"
          : this.schedule.workdayTrains.includes(trainId) ? "workday" : undefined,
        destination: this.schedule.stations[Object.keys(train).reduce((res, curr) => {
          const time = train[curr];
          if (res.time < time) {
            res.id = curr;
            res.time = time;
          }
          return res;
        }, { id: "", time: 0 }).id],
        late: trainFrom < now
      });
    }
    this.trains = trains.sort((a, b) => a.from - b.from);
  }

  swap() {
    const tmp = this.from;
    this.from = this.to;
    this.to = tmp;
  }

  private showSchedule(schedule: Schedule) {
    this.stations = Object.keys(schedule.stations)
      .map(k => ({ id: k, name: schedule.stations[k] }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.schedule = schedule;
  }

  private now() {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Belgrade" }));
    return today.getHours() + today.getMinutes() / 60;
  }
}
