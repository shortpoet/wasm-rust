import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory } from './ICategory';
import { IProject } from './IProject';

export interface IPost {
  id: number;
  title: string;
  markdown?: string;
  html?: string;
  created: Moment;
  projectId: number;
  project: IProject;
  categoryId: number;
  category: ICategory;
  tags?: ITag[];
}
