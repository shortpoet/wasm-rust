import { Moment } from 'moment';

export interface ISession {
  created: Moment;
  projectName: string;
  projectId: number;
  categoryId: number;
}