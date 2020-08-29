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

const parseQuery = (input: IPost | IProject | ICreatePost | IUpdatePost): string => {
  return Object.entries(input).reduce((cur, [k, v]) => {
    return typeof v != 'number'
      // eslint-disable-next-line
      ? cur += `${k}: """${v!.toString().replace(/"/g, '\\"')}""", `
      : cur += `${k}: ${v}, `
  }, '')
}
// https://stackoverflow.com/questions/32968332/how-do-i-prevent-the-error-index-signature-of-object-type-implicitly-has-an-an
const unParseQuery = (input: IPost | IProject ): void => {
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
  async createPost(input: ICreatePost) {
    const createPost: string = parseQuery(input)
    console.log(createPost);
    
    const query = `
      mutation {
        createPost (post: {${createPost}}) {
          id
          title
          type
          html
          markdown
          sectionId
          categoryId
          projectId
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
  async updatePost(input: IUpdatePost) {
    console.log(input);
    
    const createPost: string = parseQuery(input)
    const query = `
      mutation {
        updatePost (post: {${createPost}}) {
          id
          type
          title
          html
          markdown
          created
          sectionId
          categoryId
          projectId
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
    return await graphAxios(query);
  }
  async fetchPosts() {
    const query = `
      {
        posts{
          id
          title
          type
          html
          markdown
          sectionId
          categoryId
          created
          category{
            id
            name
          }
          tags{
            id
            name
          }
        }
      }
    `
    const response = await graphAxios(query, 'posts')
    const posts: IPost[] = response.posts.map((p: IPostDTO) => ({
      ...p,
      created: moment(p.created),
      category: p.category.name
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
    this.updateRecords()
  }
  async fetchProjects() {
    const query = `
      query {
        projects {
          id
          name
          category {
            id
            name
          }
        }
      }
    `
    const response = await graphAxios(query, 'projects')
    console.log(response.projects);
    
    const projects: IProject[] = response.projects.map((p: IProjectDTO) => ({
      ...p,
      category: p.category.name,
      categoryId: p.category.id
    }))
    if (projects) {
      this.loadRecords(projects, 'projects')
    } 
    this.state.projects.loaded = true
  }
  async fetchPostsByProject(projectName: IProject['name']) {
    const query = `
      query {
        project(name: "${projectName}"){
          id
          name
          category {
            id
            name
          }
          posts{
            id
            title
            type
            html
            markdown
            sectionId
            categoryId
            created
            category{
              id
              name
            }
            tags{
              id
              name
            }
          }
        }
      }
    `
    const response = await graphAxios(query, 'projects')
    const dto: IProjectDTO = response.project
    const project: IProject = {
      ...dto,
      category: dto.category.name,
      posts: dto.posts.map(p => ({
        ...p,
        created: moment(p.created)
      }))
    }
    if (project) {
      unParseQuery(project)
      this.state.projects.currentId = project.id.toString()
      this.loadRecords(project.posts, 'posts')
    }
    return project
  }
  public setCurrentProject(projectId: IProject['id']) {
    this.state.projects.currentId = projectId.toString();
  }
  public setCurrentPost(postId: IPost['id']) {
    this.state.posts.currentId = postId.toString();
  }
  loadRecords(records: any, module: string) {
    for (const rec of records) {
      unParseQuery(rec)
      if (!this.state[`${module}`].ids.includes(rec.id.toString())) {
        this.state[`${module}`].ids.push(rec.id.toString())
      }
      this.state[`${module}`].all[rec.id] = rec
    }
  }
  public updateRecords (): IPost[] {
    return this.state.posts.ids.reduce<any[]>((accumulator, id) => {
      const record = this.state.posts.all[id]
      return accumulator.concat(record)
    }, [])
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
export const useStore = (): Store => {
  const store = inject<Store>('store')
  // eslint-disable-next-line
  return store!
}