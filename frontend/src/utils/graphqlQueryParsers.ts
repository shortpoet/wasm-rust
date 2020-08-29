import { IPost } from "@/interfaces/IPost"
import { IProject } from "@/interfaces/IProject"
import { ICreatePost } from "@/interfaces/ICreatePost"
import { IUpdatePost } from "@/interfaces/IUpdatePost"

export const parseQuery = (input: IPost | IProject | ICreatePost | IUpdatePost): string => {
  return Object.entries(input).reduce((cur, [k, v]) => {
    return typeof v != 'number'
      // eslint-disable-next-line
      ? cur += `${k}: """${v!.toString().replace(/"/g, '\\"')}""", `
      : cur += `${k}: ${v}, `
  }, '')
}
// https://stackoverflow.com/questions/32968332/how-do-i-prevent-the-error-index-signature-of-object-type-implicitly-has-an-an
export const unParseQuery = (input: IPost | IProject ): void => {
  return Object.entries(input).forEach(([k, v]) => {
    if (typeof v == 'string') {
      input[k] = v.replace(/(\\)+"/g, '"')
    }
  })
}
