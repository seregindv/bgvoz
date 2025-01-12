import { Station } from "./station";

export class Train {
    id: string = null!;
    from: number = null!;
    to: number = null!;
    days?: string;
    destination: Station = null!;
    late: boolean = null!;
}
