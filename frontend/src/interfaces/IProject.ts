import { ICategory } from "./ICategory";
import { IPost } from "./IPost";

export interface IProject {
  id: number;
  name: string;
  categoryId: number;
  category: ICategory['name'];
  posts: IPost[];
  [key: string]: number | string | IPost[] | undefined
}