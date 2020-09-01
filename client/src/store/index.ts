import { initStoreState, Store, IStore} from './store.interface'
import { ProjectStore } from './project/project.store';
import { PostStore } from './post/post.store';
import { IProject } from '../interfaces/IProject';
import { provide, inject } from 'vue';
import { IPost } from '../interfaces/IPost';

export const PROJECT_ID_SYMBOL = 'name';
export const POST_ID_SYMBOL = 'title';

export const PROJECT_STORE_SYMBOL = Symbol('projectStore');
export const POST_STORE_SYMBOL = Symbol('postStore');

function provideStoreMaker(storeSymbol: symbol, idSymbol: string) {
  if (storeSymbol == PROJECT_STORE_SYMBOL) {
    provide(storeSymbol, new ProjectStore(idSymbol, initStoreState<IProject>()))
  } else {
    provide(storeSymbol, new PostStore(idSymbol, initStoreState<IPost>()))
  }
}


export const provideStore = () => {
  provideStoreMaker(PROJECT_STORE_SYMBOL, PROJECT_ID_SYMBOL)
  provideStoreMaker(POST_STORE_SYMBOL, POST_ID_SYMBOL)
};


export function createStore<T>(storeSymbol: symbol, idSymbol: string) {
  if (storeSymbol == PROJECT_STORE_SYMBOL) {
    return new ProjectStore(idSymbol, initStoreState<IProject>())
  } else {
    return new PostStore(idSymbol, initStoreState<IPost>())
  }
}

export const projectStore: ProjectStore = createStore<ProjectStore>(PROJECT_STORE_SYMBOL, PROJECT_ID_SYMBOL) as ProjectStore
export const postStore: PostStore = createStore(POST_STORE_SYMBOL, POST_ID_SYMBOL) as PostStore

// export function useStore<T>(storeSymbol: symbol): PostStore | ProjectStore | undefined {
//   const store: PostStore | ProjectStore | undefined = storeSymbol == PROJECT_STORE_SYMBOL
//     ? inject<ProjectStore>(storeSymbol)
//     : inject<PostStore>(storeSymbol)
//   return store
// }
// export function useStore<T>(storeSymbol: symbol): T | undefined {
//   const store: T | undefined = storeSymbol == PROJECT_STORE_SYMBOL
//     ? inject<ProjectStore>(storeSymbol)
//     : inject<PostStore>(storeSymbol)
//   return store
export function useStore<IStore>(storeSymbol: symbol): IStore | undefined {
  const store: IStore | undefined = inject(storeSymbol)
  return store
}
