import { reactive, readonly, UnwrapRef, DeepReadonly } from 'vue';
import moment from 'moment';
import { IPost } from '@/interfaces/IPost'
import { IPostDTO } from '@/interfaces/IPostDTO';
import { IProject } from '@/interfaces/IProject';
import { IProjectDTO } from '@/interfaces/IProjectDTO';
import { ICreatePost } from '@/interfaces/ICreatePost';
import { IUpdatePost } from '@/interfaces/IUpdatePost';
import { unParseQuery, parseQuery } from '@/utils/graphqlQueryParsers';
import { graphAxios } from '@/ajax';
import { colorLog } from '@/utils/colorLog';
import {  FETCH_POSTS_BY_PROJECT, POSTS_BY_PROJECT, POSTS_INIT, FETCH_POSTS, CREATE_POST, UPDATE_POST, DELETE_POST } from './constants';
import { Store, IStore, StoreState, initStoreState } from '../store.interface';





export class PostStore extends Store<IPost> {
  // protected state: StoreState<IPost>
  constructor(idSymbol: string, initialState: StoreState<IPost>) {
    super(idSymbol, initialState)
    this.idSymbol = idSymbol;
    // this.state = reactive(initStoreState<IPost>()) //as DeepReadonly<UnwrapRef<StoreState<IPost>>>
    // this.getState()
    this.state = reactive(initStoreState<IPost>())
  }

  getState(): DeepReadonly<UnwrapRef<StoreState<IPost>>> {
    return readonly<StoreState<IPost>>(this.state)
  }
  protected state: StoreState<IPost>;
  idSymbol: string
  modules?: Record<string, any> | undefined
  getRecordById<T>(id: string | number): T
  getRecordById(id: string | number): any
  getRecordById(id: any): IPost {
    return super.getRecordById(id);
  }
  public setCurrentId(id: string | number): void {
    super.setCurrentId(id);
  }

  getLast<T>(): any {
    super.getLast();
  }
  addRecords(records: any[]): void {
    super.addRecords(records);
  }
  async updateRecords(caller: string): Promise<any[]> {
    return super.updateRecords(caller);
  }

  public getLastId(): IPost['_id'] {
    const last = this.getLast<IPost>()
    return last ? last._id : '-1'
  }

  public async createRecord(input: ICreatePost) {
    const createPost: string = parseQuery(input)
    console.log(createPost);
    
    const query = CREATE_POST(input);
    const response = await graphAxios(query);
    const post: IPost = {
      ...response.createPost,
      created: moment(response.createPost.created)
    };
    unParseQuery(post);
    const record = post;
    super.createRecord(record);
    this.fetchRecords();
  }
  async deleteRecord(record: IPost): Promise<string> {
    colorLog(`delete post with id: ${record['id']}`)
    const query = DELETE_POST(record)
    const res = await graphAxios(query);
    if (res) {
      super.deleteRecord(record);
    }
    return res;
  }
  
  async editRecord(oldPost: IPost, newPost: IUpdatePost) {
    const updatePost: string = parseQuery(newPost);
    const query = UPDATE_POST(updatePost);
    console.log('writing to db')
    const response = await graphAxios(query);
    const post: IPost = {
      ...response.updatePost,
      created: moment(response.updatePost.created)
    }
    unParseQuery(post)

    super.editRecord(oldPost, post)
   }

  async fetchRecords() {
    const query = FETCH_POSTS
    const response = await graphAxios(query, POSTS_INIT)
    
    const posts: IPost[] = response.posts.map((p: IPostDTO) => ({
      ...p,
      created: moment(p.created),
      category: p.category.name
    }))

    const records = posts;
    if (records) {
      for (const rec of records) {
        unParseQuery(rec)
      }
      this.addRecords(posts)
      this.state.records.loaded = true
    } else {
      console.log("No posts Found")
    }
  }

  public async loadRecords (caller: string): Promise<any[]> {
    console.log(`load records for ${caller}`)
    if (!this.state.records.loaded) {
      console.log('fetching - not yet loaded')
      await this.fetchRecords()
    }
    console.log('loading')
    return super.updateRecords(caller);
  }

  async fetchPostsByProject(projectName: IProject['name']) {
    const query = FETCH_POSTS_BY_PROJECT(projectName)
    const response = await graphAxios(query, POSTS_BY_PROJECT)
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
      // this.state.project.currentId = project.id.toString()
      this.addRecords(project.posts)
    }
    return project
  }

}
