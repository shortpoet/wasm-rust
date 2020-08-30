import { IProject } from '@/interfaces/IProject'
import { reactive, readonly, DeepReadonly, UnwrapRef } from 'vue';
import { FETCH_PROJECTS, PROJECTS_INIT } from './constants';
import { IProjectDTO } from '@/interfaces/IProjectDTO';
import { graphAxios } from '@/ajax';
// import moment from 'moment';
import { unParseQuery } from '@/utils/graphqlQueryParsers';
import { Store, IStore, StoreState } from '../store.interface';
import { useStorage } from '@/composables/useStorage';
import { ISession } from '../session/session.interface';
import moment from 'moment';

export class ProjectStore extends Store<IProject> implements IStore<IProject> {
  protected state: StoreState<IProject>
  constructor(idSymbol: string, initialState: StoreState<IProject>) {
    super(idSymbol, initialState)
    this.idSymbol = idSymbol;
    this.state = reactive(initialState) as StoreState<IProject>
    this.getState()
  }
  getState(): DeepReadonly<UnwrapRef<StoreState<IProject>>> {
    return readonly<StoreState<IProject>>(this.state)
  }
  categoryId?: number;
  loaded = false;
  idSymbol: string;
  modules?: Record<string, any> | undefined;
  getRecordById<T>(id: string | number): T;
  getRecordById(id: string | number): any;
  getRecordById(id: any): IProject {
    return super.getRecordById(id);
  }
  public setCurrentId(id: string | number): void {
    super.setCurrentId(id);
  }
  setCategoryId(categoryId: number): void {
    this.categoryId = categoryId;
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

  public getLastId(): IProject['_id'] {
    const last = this.getLast<IProject>()
    return last ? last._id : '-1'
  }

  createRecord(record: IProject) {
    super.createRecord(record)
    // const response = await axios.post<TaskDTO>('http://localhost:3000/task/create', task)
    this.fetchRecords()
  }
  async deleteRecord(record: IProject): Promise<string> {
    console.log(record);
    
    throw new Error("Method not implemented.");
    // super.deleteRecord(task)
    // const response = await axios.delete<TaskDTO>(`http://localhost:3000/task/delete?task_id=${task._id}`)
    // return response.data.task._id
  }

  
  async editRecord(oldRecord: IProject, newRecord: IProject) {
    super.editRecord(oldRecord, newRecord)
    console.log('writing to db')
    // const response = await axios.put<TaskDTO>(
    //   `http://localhost:3000/task/update?task_id=${oldTask._id}`,
    //   newTask
    // )
  }

  async fetchRecords() {
    const query = FETCH_PROJECTS
    const response = await graphAxios(query, PROJECTS_INIT)
    // console.log(response.projects);
    
    const projects: IProject[] = response.projects.map((p: IProjectDTO) => ({
      ...p,
      category: p.category.name,
      categoryId: p.category.id
    }))
    const records = projects;
    if (records) {
      for (const rec of records) {
        unParseQuery(rec)
      }
      this.addRecords(projects)
      this.loaded = true
      this.state.records.loaded = true
    } else {
      console.log("No projects Found")
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

}
