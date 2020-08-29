import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';
import { IProject } from './IProject';
import { ISection } from './ISection';

export interface IPost {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  section: ISection['name'];
  project: IProject['name'];
  category: ICategoryName;
  type: string;
  tags?: ITag[];
  [key: string]: number | string | Moment | ICategoryName | ITag[] | undefined
}
