import { readonly, reactive, DeepReadonly, UnwrapRef, provide, inject } from "vue"
import { PROJECT_STORE_SYMBOL } from './index'
import { ProjectStore } from './project/project.store'
import { IProject } from '@/interfaces/IProject'
import { IPost } from '@/interfaces/IPost'
import { colorLog } from '@/utils/colorLog'

const debug = false;

export interface StateMap<T> {
  ids: string[];
  all: Record<string, T>;
  loaded: boolean;
  currentId?: string;
  [key: string]: string[] | Record<string, T> | boolean | string | undefined;
}

export interface StoreState<T> {
  records: StateMap<T>;
  [key: string]: StateMap<T>;
}

// https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics

export interface InitStateMap<T> {
  (): Record<string, (string[] | Record<string, T> | boolean | string | undefined)>;
}

export function initStateMap<T>(): StateMap<T> {
  return {
    ids: [
    ],
    all: {
    },
    loaded: false,
    currentId: undefined
  }
}

export interface InitStoreState<T> {
  (): Record<string, StateMap<T>>;
}

export function initStoreState<T>(): StoreState<T> {
  return {
    // records: (<T>() => initStateMap<T>())()
    records: initStateMap<T>()
  }
}

export interface IStore<T> {
  idSymbol: string;
  modules?: Record<string, any>;
  getState(): DeepReadonly<UnwrapRef<StoreState<T>>>;
  getRecordById<T>(id: string | number): T;
  getRecordById(id: string | number): any;
  setCurrentId(id: string | number, categoryId: number): void;
  setCurrentId(id: string | number): void;
  removeCurrentId(): void;
  getLast<T>(): T;
  createRecord(record: any, pushToDb: boolean): void;
  createRecord(record: any): void;
  deleteRecord(record: any): void;
  editRecord(oldRecord: any, newRecord: any): void;
  addRecords(records: any[]): void;
  fetchRecords(records: any[]): void;
  // loadRecords(caller: string): void;
  updateRecords(caller: string): Promise<any[]>;

}

abstract class BaseStore<T> implements IStore<T> {
  constructor (
    idSymbol: string,
    initialState: StoreState<T> //= initStoreState<T>()
  ) {
    this.state = reactive(initialState) as StoreState<T>
    this.idSymbol = idSymbol
    this.getState()
  }
  protected state: StoreState<T>
  idSymbol: string
  modules?: Record<string, any>
  abstract getState(): DeepReadonly<UnwrapRef<StoreState<T>>>;
  abstract getRecordById<T>(id: string | number): T;
  abstract getRecordById(id: string | number): any;
  abstract setCurrentId(id: string | number, categoryId: number): void;
  abstract setCurrentId(id: string | number): void;
  abstract removeCurrentId(): void;
  abstract getLast<T>(): T; 
  abstract getLast(): any; 
  abstract createRecord(record: any, pushToDb: boolean): void;
  abstract createRecord(record: any): void;
  abstract deleteRecord(record: any): void;
  abstract editRecord(oldRecord: any, newRecord: any): void;
  abstract addRecords(records: any[]): void;
  abstract fetchRecords(records: any[]): void;
  // abstract loadRecords(caller: string): void;
  abstract async updateRecords(caller: string): Promise<any[]>;
}

// export as default to try and suppress 
// TypeError: Super expression must either be null or a function
// instead of import { blah } from blah;
// import blah from blah;
// inconsistencies in my implementation are better recognized by compiler
export class Store<T> extends BaseStore<T> {
  constructor(idSymbol: string, initialState: StoreState<T>) {
    super(idSymbol, initialState)
  }

  public getState(): DeepReadonly<UnwrapRef<StoreState<T>>> {
    return readonly<StoreState<T>>(this.state) as DeepReadonly<UnwrapRef<StoreState<T>>>
  }

  public getRecordById<T>(id: string | number): T;
  public getRecordById(id: string | number): any {
    colorLog('get by id', undefined, debug)
    colorLog(`${id}`, undefined, debug)
    // colorLog(JSON.stringify(this.state.records), undefined, debug)
    // colorLog(JSON.stringify(this.state.records.all), undefined, debug)
    if (this.state.records.all[id]) {
      // console.log(this.state.records.all);
      // console.log(this.state.records.all[id]);
      return this.state.records.all[id]
    } else {
      console.log('is null')
      return null
    }
  }

  public setCurrentId(id: string | number): void {
    colorLog(`set current id to: ${id}`, undefined, debug)

    this.state.records.currentId = id.toString();
    colorLog(this.state.records.currentId, 1, debug)
  }
  public removeCurrentId(): void {
    this.state.records.currentId = undefined;
  }

  public getLast<T>(): any {
    // console.log('get last')
    const lastId = this.state.records.ids.slice(-1)[0]
    // if database / store are empty return null
    return this.state.records.all[lastId]
  }
  
  // createRecord(record: any, pushToDb: Boolean): Promise<void>
  public createRecord(record: any): void {
    // console.log('create record - interface')
    // console.log(record)
    // console.log(this.idSymbol)
    // TODO
    //    sequential itemId
    //    const itemId = Math.max(...this.state.records.itemIds) + 1
    //    record['itemId'] = itemId
    // #TODO
    const id = record[this.idSymbol]
    const itemId = id
    record['itemId'] = itemId
    this.state.records.all[id] = record
    this.state.records.ids.push(id.toString())
    // this.state.records.itemIds.push(itemId)
  }

  public deleteRecord(record: any): void {
    const id = record[this.idSymbol]
    delete this.state.records.all[id]
    const indexId = this.state.records.ids.indexOf(this.idSymbol.toString())
    this.state.records.ids.splice(indexId, 1)
    // const indexItemId = this.state.records.itemIds.indexOf(record['itemId'])
    // this.state.records.ids.splice(indexItemId, 1)
  }
  public editRecord(oldRecord: any, newRecord: any): void {
    const id = oldRecord[this.idSymbol]
    this.state.records.all[id] = newRecord
  }

  public addRecords(records: any[]) {
    // to avoid mutating at all costs can do reduce
    for (const record of records) {
      // do a check to account for duplicates
      if (!this.state.records.ids.includes(record[this.idSymbol])) {
        this.state.records.ids.push(record[this.idSymbol])
      }
      // using number as key to JS object, it implicitly assumes it is a string and calls .toString() automatically
      // need to first extract id because concatenating them errors
      // this.state.records.all[record][idSymbol]
      const id = record[this.idSymbol]
      this.state.records.all[id] = record
    }
    this.state.records.loaded = true
  }

  public async updateRecords (caller: string): Promise<any[]> {
    console.log(`update records for ${caller}`)
    return this.state.records.ids.reduce<any[]>((accumulator, id) => {
      const record = this.state.records.all[id]
      return accumulator.concat(record)
    }, [])
  }

  public fetchRecords(records: any[]): void {
    this.addRecords(records)
    this.state.records.loaded = true
  }

}
