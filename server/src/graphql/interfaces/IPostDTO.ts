import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory } from './ICategory';
import { IProject } from './IProject';
import { ISection } from './ISection';

export interface IPostDTO {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  sectionName: number;
  projectName: number;
  categoryName: number;
  tags?: ITag[];
  type: string;
}
