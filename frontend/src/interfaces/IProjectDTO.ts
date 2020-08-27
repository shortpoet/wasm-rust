import { ICategory } from "./ICategory";
import { IPost } from "./IPost";

export interface IProjectDTO {
  id: number;
  name: string;
  categoryId: number;
  category: ICategory;
  posts: IPost[];
}
