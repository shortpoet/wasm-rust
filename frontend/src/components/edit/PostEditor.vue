<template>
  <div class="post-editor-container" >
    <div>Post Editor</div>
    <PostWriter :post="updatePost" @save="save" v-if="loaded"/>    
  </div>
</template>

<script lang="ts">
import { IPost } from '../../interfaces/IPost'
import { defineComponent, computed } from 'vue'
import { useStore } from '../../store'
import PostWriter from '../input/PostWriter.vue'
import { IUpdatePost } from '../../interfaces/IUpdatePost'

import { useRoute, useRouter } from 'vue-router'
import { IProject } from '../../interfaces/IProject'
import { colorLog } from '../../utils/colorLog'

export default defineComponent({
  name: 'PostEditor',
  components: {
    PostWriter
  },

  async setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // on reload there is no pushed id or loaded posts param so must do 'expensive' search instead
    const loaded = computed(() => store.getState().projects.loaded)

    let project: IProject
    if (!store.getState().projects.currentId) {
      if (!store.getState().projects.loaded) {
        store.fetchProjects()
      }
      const allProjects = store.getState().projects.ids.reduce<IProject[]>((accumulator, id) => {
        const project = store.getState().projects.all[id]
        return accumulator.concat(project)
      }, [])
      project = allProjects.filter(project => project.name == route.params.name)[0]
      store.setCurrentProject(project.id)
    } else {
      project = store.getState().projects.all[store.getState().projects.currentId as string]
    }

    let post: IPost;
    if (store.getState().posts.currentId) {
      post = store.getState().posts.all[store.getState().posts.currentId as string]
    } else {
      if (!store.getState().posts.loaded) {
        await store.fetchPostsByProject(project.name)
      }
      if (route.params.title) {
        const allPosts = store.getState().posts.ids.reduce<IPost[]>((accumulator, id) => {
          const post = store.getState().posts.all[id]
          return accumulator.concat(post)
        }, [])
        post = allPosts.filter(post => post.title == route.params.title)[0]
        if (post == undefined) {
          // wrong or old name reroute home
          router.push('/')
        }
      } else {
        post = store.getState().posts.all[route.params.id as string]
      }
    }
    console.log(post);
    
    const makeUpdatePost = (p: IPost): IUpdatePost => {
      delete p['category']
      return {
        ...p,
        categoryId: parseInt(project.categoryId.toString()),
        projectId: parseInt(store.getState().projects.currentId as string)
      }
    }
    const updatePost = makeUpdatePost(post)

    const save = async (post: IPost) => {
      console.log('save');
      console.log(post);
      
      await store.updatePost(makeUpdatePost(post))
      router.push('/')
    }

    return {
      updatePost,
      save,
      loaded
    }
  }
})
</script>