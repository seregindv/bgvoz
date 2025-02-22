import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Train } from '../../data/train';
import { Station } from '../../data/station';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ScheduleData } from '../../data/schedule-data';
import { getTitle } from '../../helpers/title';
import { getTrainDays } from '../../helpers/train';
import { getDateStatus, getDuration, getTime } from '../../helpers/date';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './schedule.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  stations?: { id: string, data: Station }[];
  from?: string;
  to?: string;
  scheduleData?: ScheduleData;
  trains?: Train[];
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
    if (!this.scheduleData || !this.from || !this.to || this.from === this.to) {
      this.showNotFound();
      return;
    }
    const trains: Train[] = [];
    const now = getTime();
    const todayStatus = getDateStatus(this.scheduleData.holidays);
    const schedule = this.scheduleData.schedule;
    const departure = schedule.stations[this.from];
    const arrival = schedule.stations[this.to];
    let anyUpcoming;
    for (const trainId of Object.keys(schedule.trains)) {
      const train = schedule.trains[trainId];
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
      const trainDays = getTrainDays(trainId, this.scheduleData);
      trains.push({
        id: trainId,
        from: trainFrom,
        to: trainTo,
        days: trainDays,
        origin: schedule.stations[originStationId],
        destination: schedule.stations[destinationStationId],
        late,
        duration: getDuration(trainFrom, trainTo),
        departure,
        arrival,
        runsToday: !trainDays || trainDays === todayStatus
      });
    }
    this.trains = trains.sort((a, b) => a.from - b.from);
    if (!anyUpcoming) {
      const tomorrowStatus = getDateStatus(this.scheduleData.holidays, true);
      this.trains.forEach(t => {
        t.late = false;
        t.runsToday = !t.days || t.days === tomorrowStatus;
      });
    }

    let waitTimeIndex = 0;
    for (let i = 0; i < this.trains.length && waitTimeIndex < 3; i++) {
      const train = this.trains[i];
      if (train.late) {
        continue;
      }
      train.waitTime = (train.from == now) ? 'now' : ('in ' + getDuration(now, train.from))
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
    this.title.setTitle(getTitle(`${departure.name}-${arrival.name}`));
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

  private showSchedule(scheduleData: ScheduleData) {
    this.stations = scheduleData.stations;
    this.scheduleData = scheduleData;
  }
}
