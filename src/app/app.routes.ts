import { Routes } from '@angular/router';
import { TrainComponent } from './train/train.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { getTitle } from '../helpers/title';
import { SchemaComponent } from './schema/schema.component';

const schedule = "schedule";
const schemaTitle = getTitle('Schema');

export const routes: Routes = [
    { path: "", redirectTo: schedule, pathMatch: 'full' },
    { path: schedule, component: ScheduleComponent, title: getTitle('Schedule') },
    { path: "train/:id", component: TrainComponent, title: route => getTitle('Train ' + route.params['id']) },
    { path: "schema", component: SchemaComponent, title: getTitle('Schema') },
    {
        path: "schema/:id", component: SchemaComponent,
        title: route => getTitle(`Train ${route.params['id']} Schema`)
    }
];
