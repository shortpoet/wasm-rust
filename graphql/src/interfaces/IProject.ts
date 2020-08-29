import { ICategory } from "./ICategory";
import { IPost } from "./IPost";
import { ISection } from "./ISection";

export interface IProject {
  id: number;
  name: string;
  categoryId: number;
  category: ICategory;
  posts: IPost[];
  sections: ISection[];
}
