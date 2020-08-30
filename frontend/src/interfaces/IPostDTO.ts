import { Moment } from 'moment';
import { ITag } from './ITag';
import { ICategory, ICategoryName } from './ICategory';
import { ISection } from './ISection';
import { IProject } from './IProject';

export interface IPostDTO {
  id: string;
  title: string;
  markdown?: string;
  html?: string;
  type: string;
  created: Moment;
  projectName: string;
  sectionName: string;
  categoryName: string;
  project: IProject;
  category: ICategory;
  section: ISection;
  tags?: ITag[];
  [key: string]: number | string | Moment | ICategory | ISection | ITag[] | IProject | undefined
}
