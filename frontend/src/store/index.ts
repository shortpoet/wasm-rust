import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { IUser } from "../interfaces/IUser"
import { IPost } from "../interfaces/IPost"
import { IAuthor } from "../interfaces/IAuthor"
import { graphAxios } from "../ajax"
import { ICreateUser } from "../interfaces/ICreateUser"
import moment from 'moment'

import { useStorage } from "../composables/useStorage"
import { CURRENT_USER_ID_STORAGE_KEY } from "../constants"
import { colorLog } from "../utils/colorLog"
import { chalkLog } from "../utils/chalkLog"

interface StoreState<T> {
  ids: string[];
  all: Record<string, T>;
  loaded: boolean;
  currentId?: string;
}

export interface State {
  posts: StoreState<IPost>
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

export const initialStoreState = <T extends {}>(x: T): StoreState<T> => ({
  ids: [
  ],
  all: {
  },
  loaded: false,
  currentId: undefined
})

export const initialState = () : State => ({
  // authors: iSS<IAuthor>(),
  posts: initialStoreState<IPost>({} as IPost)
})

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const localStorage = useStorage();

const parseQuery = (input: Record<any, any>): string => {
  return Object.entries(input).reduce((cur, [k, v]) => {
    return typeof v != 'number'
      ? cur += `${k}: """${v.toString().replace(/"/g, '\\"')}""", `
      : cur += `${k}: ${v}, `
  }, '')
}
const unParseQuery = (input: Record<any, any>): void => {
  return Object.entries(input).forEach(([k, v]) => {
    if (typeof v == 'string') {
      input[k] = v.replace(/(\\)+"/g, '"')
    }
  })
}


class Store {
  protected state: State
  constructor(initialState: State) {
    this.state = reactive<State>(initialState) as State
  }

  public getState(): State {
    return readonly(this.state) as State
  }



  async createPost(input: IPost) {
    delete input['id']

    const createPost: string = parseQuery(input)

    const query = `
      mutation {
        createPost (post: {${createPost}}) {
          id
          title
          html
          markdown
          created
        }
      }
    `
    const response = await graphAxios(query);
    const post: IPost = {
      ...response.createPost,
      created: moment(response.createPost.created)
    }
    unParseQuery(post)
    this.state.posts.all[response.createPost.id] = post
    this.state.posts.ids.push(post.id.toString())
  }
  async updatePost(input: IPost) {
    // delete input['id']

    const createPost: string = parseQuery(input)

    const query = `
      mutation {
        updatePost (post: {${createPost}}) {
          id
          userId
          title
          html
          markdown
          created
        }
      }
    `
    const response = await graphAxios(query);
    const post: IPost = {
      ...response.updatePost,
      created: moment(response.updatePost.created)
    }
    unParseQuery(post)
    this.state.posts.all[response.updatePost.id] = post
  }

  async deletePost(id: string) {
    colorLog(`delete post with id: ${id}`)
    const query = `
      mutation {
        deletePost(id: "${id}")
      }
    `
    // colorLog(await graphAxios(query))
    return await graphAxios(query);
  }

  async fetchPosts() {
    const query = `
      {
        posts {
          id
          title
          markdown
          html
          userId
          created
        }
      }
    `
    const response = await graphAxios(query, 'posts')
    const posts = response.posts.map(p => ({
      ...p,
      created: moment(p.created)
    }))
    if (posts) {
      for (const post of posts) {
        unParseQuery(post)
        if (!this.state.posts.ids.includes(post.id.toString())) {
          this.state.posts.ids.push(post.id.toString())
        }
        this.state.posts.all[post.id] = post
      }
    } 
    this.state.posts.loaded = true
  }

}

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

export const useStore = (): Store | undefined=> {
  const store = inject<Store>('store')
  return store
}