import { Station } from "../../data/station";

export interface TrainStation {
    id: string;
    name: string;
    time: number;
    google: string;
    osmand: string;
    yandex: string;
}
