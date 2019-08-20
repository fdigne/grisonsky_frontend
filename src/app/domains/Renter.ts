import { Bill } from './Bill';

export class Renter {
  id: number;
  name: string;
  password: string;
  appartments: string;
  admin: boolean;
  bill: Bill;
  billLastPayed: Date;
}