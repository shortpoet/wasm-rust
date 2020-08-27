import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';

export interface IPost {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  category: ICategoryName;
  tags?: ITag[];
  [key: string]: number | string | Moment | ICategoryName | ITag[] | undefined
}
