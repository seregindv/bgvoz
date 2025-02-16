import { Schedule } from "./schedule";
import { Station } from "./station";

export class ScheduleData {
    stations: { id: string; data: Station; }[] = null!;
    schedule: Schedule = null!;
    holidayTrains: Set<string> = null!;
    workdayTrains: Set<string> = null!;
}
