import { IPost } from "./IPost";
import { ICategory } from "./ICategory";

export interface ITag {
  id: number;
  name: string;
  posts: IPost[];
}
