import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';
import { ISection } from './ISection';
import { IProject } from './IProject';

export interface IUpdatePost {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  categoryName: string;
  sectionName: ISection['name'];
  projectName: IProject['name'];
  tags?: ITag[];
  [key: string]: string | Moment | ICategory | ITag[] | undefined | number
}
