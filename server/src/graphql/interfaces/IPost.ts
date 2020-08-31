import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory } from './ICategory';
import { IProject } from './IProject';
import { ISection } from './ISection';

export interface IPost {
  id: number;
  title: string;
  type: string;
  markdown?: string;
  html?: string;
  created: Moment;
  sectionId: number;
  section: ISection;
  projectId: number;
  project: IProject;
  categoryId: number;
  category: ICategory;
  tags?: ITag[];
}
