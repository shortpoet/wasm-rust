<template>
  <div class="project-viewer">
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p>Project Name: {{ project.name }}</p>
        <p>Project Category: {{ project.category }}</p>
      </div>
      <div class="message-body">
        <p>Posts by type (default all)</p>
      </div>
    </div>
    <nav class="control-panel is-primary panel">
      <p class="panel-tabs">
        <!-- define a test specific selector so that future code changes to tag, class, or id, which don't nec change functionality, don't break test eg a => div -->
        <a v-for="type in types" :key="type" data-test="type"
          :class="[ type == selectedType ? 'is-active' : '']"
          @click="setType(type)"
        >
          {{ type }}
        </a>
      </p>
      <a class="panel-block">
        <span class="control-element">
          <button class="button is-pulled-right is-rounded" @click.prevent="newPost" style="">
            <i class="fa fa-edit"></i>
          </button>
          <p>NewPost</p>
        </span>
      </a>
    </nav>
    <ProjectPost v-for="post in posts" :key="post.id" :post="post"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore, POST_STORE_SYMBOL } from '../../store'
// import { useMarkdown } from '../../composables/useMarkdown'

// import marked from "marked"
// import hljs from "highlight.js"

import { useRoute, useRouter } from 'vue-router'
import { IProject } from '../../interfaces/IProject'
import { colorLog } from '../../utils/colorLog'
import { IPost } from '../../interfaces/IPost'
import ProjectPost from './ProjectPost.vue'
import { PostStore } from '../../store/post/post.store'

export default defineComponent({
  name: 'ProjectViewer',
  components: {
    ProjectPost
  },
  async setup() {
    const route = useRoute()
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore
    const router = useRouter()


    if (!postStore.getState().projects.loaded) {
      await postStore.fetchRecords()
    }    
    const types: IPost['type'][] = ['intro', 'code', 'all']

    const selectedType = ref<IPost['type']>()
    colorLog(JSON.stringify(route.params), 0)
    const project: IProject = await postStore.fetchPostsByProject(route.params.name as string)

    const posts = computed(() => project.posts.filter(post => {
      // console.log(post);
      return selectedType.value ? post.type == selectedType.value : true
    }))

    const setType = (type: IPost['type']) => {
      selectedType.value = type == 'all' ? '' : type
    }
    // colorLog('posts')
    // console.log(posts.value);

    const newPost = () => {
      router.push({ name: 'NewPost', params: {id: project.id, name: project.name, category: project.category, categoryId: project.categoryId}})
    }
    return {
      project,
      setType,
      types,
      selectedType,
      posts,
      newPost
    }
  }
})
</script>
<style lang="scss">
</style>