import { Station } from "./station";

export class Train {
    id: string = null!;
    from: number = null!;
    to: number = null!;
    days?: string;
    origin: Station = null!;
    destination: Station = null!;
    late: boolean = null!;
    duration: string = null!;
    departure: Station = null!;
    arrival: Station = null!;
    waitTime?: string;
    runsToday?: boolean;
}
