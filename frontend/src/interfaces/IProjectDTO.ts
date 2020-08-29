import { ICategory } from "./ICategory";
import { IPost } from "./IPost";
import { ISection } from './ISection';

export interface IProjectDTO {
  id: number;
  name: string;
  categoryId: number;
  category: ICategory;
  sections: ISection[];
  posts: IPost[];
}
