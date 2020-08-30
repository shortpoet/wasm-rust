import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import WaitEditPost from '../components/edit/WaitEditPost.vue'
import WaitShowProject from '../components/display/WaitShowProject.vue'
import WaitShowPost from '../components/display/WaitShowPost.vue'
import WaitNewPost from '../components/display/WaitNewPost.vue'
import { projectStore, postStore } from '../store'
import { PROJECTS } from '@/store/project/constants'
import { ProjectStore } from '@/store/project/project.store'
import { colorLog } from '@/utils/colorLog'

// const beforeProjects = async (to: any, from: any, next: any) => {
//   if (!projectStore.getState().projects.loaded) {
//     await projectStore.fetchRecords()
//   }
//   next()
// }
// const beforePosts = async (to: any, from: any, next: any) => {
//   if (!postStore.getState().posts) {
//     colorLog('before beforePosts')
//     await postStore.fetchRecords()
//     console.log(postStore);
    
//   }
//   next()
// }

export const routes =  [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'WaitShowProject',
    path: '/projects/:category/:name',
    component: WaitShowProject
  },
  {
    name: 'WaitShowPost',
    path: '/projects/:category/:name/posts/:title',
    component: WaitShowPost
    // props: (route: any) => ({ id: route.query.q })
  },
  {
    name: 'WaitNewPost',
    path: '/projects/:category/:name/posts/new',
    component: WaitNewPost,
    // beforeEnter: (to: any, from: any, next: any) => beforePosts(to, from, next)
  },
  {
    name: 'WaitEditPost',
    path: '/projects/:category/:name/posts/edit/:title',
    component: WaitEditPost,
  },
  {
    path: '/:catchAll(.*)',
    component: Home
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export const makeRouter = () => createRouter({
  history: createWebHistory(),
  routes: routes
})



// https://github.com/vuejs/vue-router-next/blob/master/playground/router.ts
// redirect catch-all
// router.beforeEach((to, from, next) => {
//   if (/.\/$/.test(to.path)) {
//     to.meta.redirectCode = 301
//     next(to.path.replace(/\/$/, ''))
//   } else next()
//   // next()
// })
