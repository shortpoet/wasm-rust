import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';

export interface ICreatePost {
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  projectId: number;
  categoryId: number;
  type: string;
  tags?: ITag[];
  [key: string]: number | string | Moment  | ITag[] | undefined
}
