<template>
  <div class="post-editor-container" >
    <div>Post Editor</div>
    <PostWriter :post="updatePost" @save="save" v-if="loaded"/>    
  </div>
</template>

<script lang="ts">
import { IPost } from '../../interfaces/IPost'
import { defineComponent, computed } from 'vue'
import { useStore, POST_STORE_SYMBOL, PROJECT_STORE_SYMBOL } from '../../store'
import PostWriter from '../input/PostWriter.vue'
import { IUpdatePost } from '../../interfaces/IUpdatePost'

import { useRoute, useRouter } from 'vue-router'
import { IProject } from '../../interfaces/IProject'
import { colorLog } from '../../utils/colorLog'
import { PostStore } from '../../store/post/post.store'
import { ProjectStore } from '../../store/project/project.store'
import { PROJECTS } from '../../store/project/constants'
import { POSTS } from '../../store/post/constants'

export default defineComponent({
  name: 'PostEditor',
  components: {
    PostWriter
  },

  async setup() {
    const route = useRoute()
    const router = useRouter()
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore
    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore

    // on reload there is no pushed id or loaded posts param so must do 'expensive' search instead
    const loaded = computed(() => projectStore.getState().records.loaded)

    let project: IProject
    if (!projectStore.getState().records.currentId) {
      if (!projectStore.getState().records.loaded) {
        projectStore.fetchRecords()
      }
      const allProjects = await projectStore.loadRecords(PROJECTS)
      project = allProjects.filter(project => project.name == route.params.name)[0]
      projectStore.setCurrentId(project.id)
    } else {
      project = projectStore.getRecordById(projectStore.getState().records.currentId as string)
    }

    let post: IPost;
    if (postStore.getState().records.currentId) {
      colorLog('1')
      post = postStore.getRecordById(postStore.getState().records.currentId as string)
      console.log(post);
      
    } else {
      colorLog('2')
      if (!postStore.getState().records.loaded) {
        await postStore.fetchPostsByProject(project.name)
      }
      if (route.params.title) {
        colorLog('3')
        const allPosts = await postStore.loadRecords(POSTS)
        post = allPosts.filter(post => post.title == route.params.title)[0]
        if (post == undefined) {
          // wrong or old name reroute home
          router.push('/')
        }
      } else {
        colorLog('4')
        post = postStore.getRecordById(route.params.id as string)
      }
    }
    console.log(post);
    
    const makeUpdatePost = (p: IPost): IUpdatePost => {
      delete p['category']
      return {
        ...p
      }
    }
    const updatePost = makeUpdatePost(post)

    const save = async (post: IPost) => {
      console.log('save');
      console.log(post);
      
      await postStore.editRecord(post, makeUpdatePost(post))
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