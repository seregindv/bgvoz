import { AfterViewInit, Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SchemaComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef<SVGElement>, private activatedRoute: ActivatedRoute, private dataService: DataService) { }

  ngAfterViewInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const trainId = snapshot.params['id'];
    if (!trainId) {
      return;
    }

    this.dataService.getData().subscribe({
      next: schedule => {
        const train = schedule.schedule.trains[trainId];
        const from = snapshot.queryParams['from'];
        const to = snapshot.queryParams['to'];
        const fromTime = train[from];
        const toTime = train[to];
        this.elementRef.nativeElement.querySelectorAll('.schema-station').forEach(e => {
          const stationId = e.id.substring(5); // 'schSt'.length
          const time = train[stationId];
          e.classList.toggle('train', time != null);
          e.classList.toggle('route', time != null && time >= fromTime && time <= toTime);
        });
      }, error: () => { /* TODO */ }
    });
  }
}
