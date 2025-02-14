import { Routes } from '@angular/router';
import { TrainComponent } from './train/train.component';
import { ScheduleComponent } from './schedule/schedule.component';

const schedule = "schedule";

export const routes: Routes = [
    { path: "", redirectTo: schedule, pathMatch: 'full' },
    { path: schedule, component: ScheduleComponent, title: 'BG:voz - Schedule' },
    { path: "train/:id", component: TrainComponent, title: route => `BG:voz - Train ${route.params['id']}` }];
