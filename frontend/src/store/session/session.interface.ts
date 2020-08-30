import { Moment } from 'moment';

export interface ISession {
  created: Moment;
  projectName: string;
  categoryName: string;
}