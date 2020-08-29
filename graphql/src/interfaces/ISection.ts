import { IPost } from "./IPost";

export interface ISection {
  id: number;
  name: string;
  projectId: number;
  posts: IPost[];
}