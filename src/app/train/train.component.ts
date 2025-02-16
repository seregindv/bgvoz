import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ScheduleData } from '../../data/schedule-data';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainStation } from './train-station';
import { getTrainDays } from '../../helpers/train';
import { Title } from '@angular/platform-browser';
import { getTitle } from '../../helpers/title';

@Component({
  selector: 'app-train',
  imports: [CommonModule],
  templateUrl: './train.component.html'
})
export class TrainComponent implements OnInit {
  stations?: TrainStation[];
  header?: string;
  days?: string;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private title: Title) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe({
      next: scheduleData => this.show(scheduleData),
      // TODO
      error: () => { }
    });
  }
  private show(scheduleData: ScheduleData) {
    const trainId = this.activatedRoute.snapshot.params['id'];
    const train = scheduleData.schedule.trains[trainId];
    const stations = scheduleData.schedule.stations;
    this.stations = Object.keys(train).map(stationId => {
      const station = stations[stationId];
      return {
        id: stationId,
        name: station.name,
        time: train[stationId],
        apple: `http://maps.apple.com/?ll=${station.lat},${station.lon}`,
        google: `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lon}&query_place_id=${station.placeId}`,
        osmand: `https://osmand.net/map?pin=${station.lat},${station.lon}`,
        // yandex: `https://maps.yandex.ru/?ll=${station.lon},${station.lat}&text=${station.name}&z=17`
        yandex: `https://yandex.com/maps?whatshere%5Bpoint%5D=${station.lon}%2C${station.lat}`
      };
    }).sort((a, b) => a.time - b.time);

    this.header = `${trainId} ${this.stations[0].name} — ${this.stations[this.stations.length - 1].name}`;
    this.days = getTrainDays(trainId, scheduleData);
    this.title.setTitle(getTitle('Train ' + this.header));
  }
}
