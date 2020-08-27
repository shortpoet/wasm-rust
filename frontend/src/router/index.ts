import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NewPost from '../components/input/NewPost.vue'
import WaitEditPost from '../components/edit/WaitEditPost.vue'
import WaitShowPost from '../components/display/WaitShowPost.vue'

export const routes =  [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'WaitShowPost',
    path: '/posts/:title',
    component: WaitShowPost
    // props: (route: any) => ({ id: route.query.q })
  },
  {
    name: 'NewPost',
    path: '/posts/new',
    component: NewPost,
  },
  {
    name: 'WaitEditPost',
    path: '/posts/:title/edit',
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
