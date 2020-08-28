import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NewPost from '../components/input/NewPost.vue'
import WaitEditPost from '../components/edit/WaitEditPost.vue'
import WaitShowProject from '../components/display/WaitShowProject.vue'
import WaitShowPost from '../components/display/WaitShowPost.vue'
import { store } from '@/store'

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
    name: 'NewPost',
    path: '/projects/:category/:name/posts/new',
    component: NewPost,
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

router.beforeEach(async (to, from, next) => {
  if (!store.getState().projects.loaded) {
    await store.fetchProjects()
  }
  next()
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
