import { ScheduleData } from '../data/schedule-data';

export function getTrainDays(trainId: string, schedule: ScheduleData) {
    return schedule.holidayTrains.has(trainId) ? "holiday"
        : schedule.workdayTrains.has(trainId) ? "workday" : undefined;
}