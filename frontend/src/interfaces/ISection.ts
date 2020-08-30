import { IPost } from "./IPost";
import { IPostDTO } from './IPostDTO';

export interface ISection {
  id: number;
  name: string;
  projectName: string;
  posts: IPost[];
  [key: string]: number | string | IPost[]

}