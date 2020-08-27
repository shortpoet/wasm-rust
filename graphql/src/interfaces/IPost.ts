import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory } from './ICategory';

export interface IPost {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  categoryId: number;
  category: ICategory;
  tags?: ITag[];
}
