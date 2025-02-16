import { Routes } from '@angular/router';
import { TrainComponent } from './train/train.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { getTitle } from '../helpers/title';

const schedule = "schedule";

export const routes: Routes = [
    { path: "", redirectTo: schedule, pathMatch: 'full' },
    { path: schedule, component: ScheduleComponent, title: getTitle('Schedule') },
    { path: "train/:id", component: TrainComponent, title: route => getTitle('Train ' + route.params['id']) }
];
