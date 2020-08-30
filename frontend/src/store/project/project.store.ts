import { IProject } from '@/interfaces/IProject'
import { reactive, readonly, DeepReadonly, UnwrapRef } from 'vue';
import { FETCH_PROJECTS, PROJECTS_INIT, CREATE_SECTION } from './constants';
import { IProjectDTO } from '@/interfaces/IProjectDTO';
import { graphAxios } from '@/ajax';
// import moment from 'moment';
import { unParseQuery, parseQuery } from '@/utils/graphqlQueryParsers';
import { Store, IStore, StoreState } from '../store.interface';
import { useStorage } from '@/composables/useStorage';
import { ISession } from '../session/session.interface';
import moment from 'moment';
import { ICreateSection } from '@/interfaces/ICreateSection';
import { colorLog } from '@/utils/colorLog';

const debug = true;

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
  categoryName?: string;
  loaded = false;
  idSymbol: string;
  modules?: Record<string, any> | undefined;
  getRecordById<T>(id: string | number): T;
  getRecordById(id: string | number): any;
  getRecordById(id: any): IProject {
    return super.getRecordById(id);
  }
  public setCurrentId(id: string | number): void {
    colorLog(`set current id to: ${id}`, undefined, debug)
    super.setCurrentId(id);
  }
  public removeCurrentId(): void {
    colorLog('remove current id', undefined, debug)
    super.removeCurrentId();
  }
  public getCurrentKey(key: string): IProject[keyof IProject] {
    return this.state.records.all[this.state.records.currentId as string][key];
  }
  public getCurrentId(): IProject['name'] {
    return this.state.records.all[this.state.records.currentId as string].name;
  }
  public getCurrentProject(): IProject {
    colorLog('get current project', undefined, debug)
    console.log(this.state.records.currentId);
    console.log(this.state.records);
    
    return this.state.records.all[this.state.records.currentId as string];
  }
  setCategoryName(categoryName: string): void {
    this.categoryName = categoryName;
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
  async createSection(sectionName: string, oldRecord: IProject) {
    // super.editRecord(o, n)
    // const newRecord: IProject = {
    //   ...oldRecord
    //   sections: oldRecord.sections.concat()
    // }
    const createSection: ICreateSection = {
      name: sectionName,
      projectId: oldRecord.id
    }
    console.log(createSection);
    console.log(typeof createSection.projectId);
    console.log(createSection.projectId);
    // console.log(parseInt(createSection.projectId));
    
    const query = CREATE_SECTION(parseQuery(createSection))
    console.log(query);
    
    const response = await graphAxios(query)
    console.log(response);
    

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
    const projects: IProject[] = response.projects.map((p: IProjectDTO) => ({
      ...p,
      id: parseInt(p.id),
      categoryName: p.category.name
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
