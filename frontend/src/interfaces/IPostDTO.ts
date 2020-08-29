import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';
import { ISection } from './ISection';

export interface IPostDTO {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  type: string;
  created: Moment;
  category: ICategory;
  section: ISection;
  tags?: ITag[];
  [key: string]: number | string | Moment | ICategory | ISection | ITag[] | undefined
}
