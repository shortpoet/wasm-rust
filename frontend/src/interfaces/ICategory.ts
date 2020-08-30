import { IPost } from "./IPost";

export type ICategoryName = 'browser' | 'deno' | 'faas' | 'nodejs' | 'rust' | 'ssvm' | 'tencentcloud'

export interface ICategory {
  name: ICategoryName;
  posts: IPost[];
}
