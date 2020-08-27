import { Moment } from "moment";

export interface IPost {
  id: number;
  title: string;
  markdown: string;
  html: string;
  userId: number;
  created: Moment;
  [key: string]: string | number | Moment;
  // https://stackoverflow.com/questions/32968332/how-do-i-prevent-the-error-index-signature-of-object-type-implicitly-has-an-an
}
