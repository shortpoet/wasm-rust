import { IPost } from "./IPost";
import { IPostDTO } from './IPostDTO';

export interface ISection {
  id: number;
  name: string;
  projectId: number;
  posts: IPost[];
}