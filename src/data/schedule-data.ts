import { Schedule } from "./schedule";
import { Station } from "./station";

export class ScheduleData {
    startDate: string = null!;
    endDate: string = null!;
    stations: { id: string; data: Station; }[] = null!;
    schedule: Schedule = null!;
    holidayTrains: Set<string> = null!;
    workdayTrains: Set<string> = null!;
    holidays: string[] = null!;
}
