import { ICategory } from "./ICategory";
import { IPost } from "./IPost";
import { ISection } from './ISection';
import { IPostDTO } from './IPostDTO';

export interface IProjectDTO {
  id: string;
  name: string;
  categoryId: number;
  category: ICategory;
  sections: ISection[];
  // disabled circular auto import can do manually if necessary
  // posts: IPostDTO[];
}
