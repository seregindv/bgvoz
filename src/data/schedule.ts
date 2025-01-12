export class Schedule {
    startDate: string = null!;
    endDate: string = null!;
    holidays: string[] = null!;
    workdayTrains: string[] = null!;
    holidayTrains: string[] = null!;
    stations: { [key: string]: string } = null!;
    trains: { [key: string]: { [key: string]: number } } = null!;
}
