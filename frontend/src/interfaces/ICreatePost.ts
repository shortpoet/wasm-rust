import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';
import { ISection } from './ISection';
import { IProject } from './IProject';

export interface ICreatePost {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  sectionName: ISection['name'];
  projectName: IProject['name'];
  categoryName: ICategoryName;
  type: string;
  tags?: ITag[];
  [key: string]: string | Moment  | ITag[] | undefined | number
}
