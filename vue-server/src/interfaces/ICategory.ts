import { IPost } from "./IPost";

export interface ICategory {
  id: number;
  name: string;
  posts: IPost[];
}
