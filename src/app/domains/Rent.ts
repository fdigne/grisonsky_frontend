import { Client } from "./Client";
import { Period } from "./Period";
import { Renter } from "./Renter";

export class Rent {
    id: number;
    client: Client;
    period: Period;
    nbClient: number;
    cleaning: boolean;
    site: string;
    price: number;
    comments: string;
    renter: Renter;
    appartment: string;
    parking: boolean;
}