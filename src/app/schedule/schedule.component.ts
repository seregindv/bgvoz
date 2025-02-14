import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Schedule } from '../../data/schedule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Train } from '../../data/train';
import { Station } from '../../data/station';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [DataService],
  templateUrl: './schedule.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  stations?: { id: string, data: Station }[];
  from?: string;
  to?: string;
  schedule?: Schedule;
  trains?: Train[];
  holidayTrains?: Set<string>;
  workdayTrains?: Set<string>;
  isError = false;
  message?: string;
  @ViewChildren('train') trainElements: QueryList<ElementRef> = null!;

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute, private title: Title) {
  }

  ngAfterViewInit(): void {
    this.trainElements.changes.subscribe(e => {
      let lastTrain;
      let firstTrain = e.find((t: ElementRef) => {
        lastTrain = t;
        return !t.nativeElement.classList.contains('late');
      });
      firstTrain = firstTrain || lastTrain;
      firstTrain?.nativeElement.scrollIntoView();
    });
  }

  ngOnInit(): void {
    this.dataService.getData().subscribe({
      next: schedule => {
        this.showSchedule(schedule);
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const from = queryParams['from'];
        const to = queryParams['to'];
        if (from || to) {
          this.from = from;
          this.to = to;
          this.search();
        }
      }, error: () => { this.showMessage('Error loading schedule', true); }
    });
  }

  async search() {
    this.hideMessage();
    if (!this.schedule || !this.from || !this.to || !this.holidayTrains || !this.workdayTrains || this.from === this.to) {
      this.showNotFound();
      return;
    }
    const trains: Train[] = [];
    const now = this.now();
    const departure = this.schedule.stations[this.from];
    const arrival = this.schedule.stations[this.to];
    let anyUpcoming;
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
      const late = trainFrom < now;
      if (!late) {
        anyUpcoming = true;
      }
      trains.push({
        id: trainId,
        from: trainFrom,
        to: trainTo,
        days: this.holidayTrains.has(trainId) ? "holiday"
          : this.workdayTrains.has(trainId) ? "workday" : undefined,
        origin: this.schedule.stations[originStationId],
        destination: this.schedule.stations[destinationStationId],
        late,
        duration: this.getDuration(trainFrom, trainTo),
        departure,
        arrival
      });
    }
    this.trains = trains.sort((a, b) => a.from - b.from);
    if (!anyUpcoming) {
      this.trains.forEach(t => t.late = false);
    }

    let waitTimeIndex = 0;
    for (let i = 0; i < this.trains.length && waitTimeIndex < 3; i++) {
      const train = this.trains[i];
      if (train.late) {
        continue;
      }
      train.waitTime = (train.from == now) ? 'now' : ('in ' + this.getDuration(now, train.from))
      waitTimeIndex++;
    }

    if (!this.trains[0]) {
      this.showNotFound();
    }
    const queryParams = {
      from: this.from,
      to: this.to
    };
    await this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
    this.title.setTitle(`BG:voz - ${departure.name}-${arrival.name}`);
  }

  swap() {
    const tmp = this.from;
    this.from = this.to;
    this.to = tmp;
  }

  private hideMessage() {
    this.message = undefined;
  }

  private showNotFound() {
    this.showMessage('No trains found');
  }

  private showMessage(text: string, isError = false) {
    this.message = text;
    this.isError = isError;
  }

  private getDuration(from: number, to: number) {
    if (from > to) {
      to += 24;
    }
    const minuteDiff = Math.round(to * 100 % 100 - from * 100 % 100)
    const hourDiff = Math.floor(to) - Math.floor(from);
    let result = '';
    if (minuteDiff === 0 && hourDiff === 0) {
      return result;
    }
    const diff = hourDiff * 60 + minuteDiff;
    const minutes = diff % 60;
    const hours = Math.floor(diff / 60);
    if (minutes > 0) {
      result = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`
    }
    if (hours > 0) {
      const hourResult = `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
      result = result ? `${hourResult} ${result}` : hourResult;
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
    return today.getHours() + today.getMinutes() / 100;
  }
}
