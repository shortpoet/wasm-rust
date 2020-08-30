import { ICategory } from "./ICategory";
import { IPost } from "./IPost";
import { ISection } from './ISection';

export interface IProject {
  id: number;
  name: string;
  categoryName: ICategory['name'];
  sections: ISection[];
  // posts: IPost[];
  [key: string]: number | string | IPost[] | ISection[] 
}
