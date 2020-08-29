import { reactive, readonly, provide, inject } from "vue"
import { IPost } from "../src/interfaces/IPost"
import { IPostDTO } from "../src/interfaces/IPostDTO"
import { IProjectDTO } from "../src/interfaces/IProjectDTO"
import { graphAxios } from "../src/ajax"
import moment from 'moment'

import { colorLog } from "../src/utils/colorLog"
import { IProject } from '@/interfaces/IProject'
import { ICreatePost } from '@/interfaces/ICreatePost'
import { IUpdatePost } from '@/interfaces/IUpdatePost'

interface StoreState<T> {
  ids: string[];
  all: Record<string, T>;
  loaded: boolean;
  currentId?: string;
}

export interface State {
  projects: StoreState<IProject>;
  posts: StoreState<IPost>;
  [key: string]: StoreState<IProject | IPost>;
}

// https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics


export function iSS<T>(): StoreState<T> {
  return {
    ids: [
    ],
    all: {
    },
    loaded: false,
    currentId: undefined
  }
}

// this version throws 
// 33:49  warning  'x' is defined but never used                      @typescript-eslint/no-unused-vars
// export const initialStoreState = <T extends {}>(x: T): StoreState<T> => ({
//   ids: [
//   ],
//   all: {
//   },
//   loaded: false,
//   currentId: undefined
// })

export const initialState = (): State => ({
  // authors: iSS<IAuthor>(),
  // posts: initialStoreState<IPost>({} as IPost)
  projects: iSS<IProject>(),
  posts: iSS<IPost>()
})


export const store = new Store(initialState())
store.getState()
export const provideStore = () =>  {
  provide('store', store)
}
// this way did not do default type checking without declaring type: State
// export const createStore = (initState?: State) => {
//   return initState
//     ? new Store(initState)
//     : new Store(initialState())
// }
export const createStore = (initState: State = initialState()) => {
  return new Store(initState)
}
export const useStore = (): Store => {
  const store = inject<Store>('store')
  // eslint-disable-next-line
  return store!
}