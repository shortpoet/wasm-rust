import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';

export interface IPostDTO {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  category: ICategory;
  tags?: ITag[];
  [key: string]: number | string | Moment | ICategory | ITag[] | undefined
}
