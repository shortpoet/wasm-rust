import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';

export interface IUpdatePost {
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  categoryId: number;
  projectId: number;
  tags?: ITag[];
  [key: string]: number | string | Moment | ICategory | ITag[] | undefined
}
