<template>
  <div class="columns">
    <div class="column"/>
    <div class="column is-two-thirds">
      <a data-test="can-edit" @click="editPost" class="button is-pulled-right is-rounded is-link">
        <i class="fas fa-edit" />
      </a>
      <h1>
        Post Title is: {{ post.title }}
      </h1>
      <div class="post-body" v-html="html"></div>
    </div>
    <div class="column"/>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useStore, POST_STORE_SYMBOL } from '../../store'
import { useMarkdown } from '../../composables/useMarkdown'

import marked from "marked"
import hljs from "highlight.js"

import { useRoute, useRouter } from 'vue-router'
import { IPost } from '../../interfaces/IPost'
import { colorLog } from '../../utils/colorLog'
import { PostStore } from '../../store/post/post.store'
import { POSTS } from '../../store/post/constants'

export default defineComponent({
  name: 'PostViewer',
  components: {
  },
  async setup(props) {
    const route = useRoute()
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore
    const router = useRouter()
    colorLog('post viewer')
    console.log(route.params.name);
    
    // on reload there is no pushed id or loaded posts param so must do 'expensive' search instead

    if (!postStore.getState().records.loaded) {
      await postStore.fetchRecords()
    }

    const post: IPost = postStore.getRecordById(route.params.name as string)

    const update = useMarkdown().update
    const html = ref()
    if (post.html) {
      html.value = update(post.html)
    }
    const editPost = () => {
      colorLog('#### to edit post ####')
      postStore.setCurrentId(post.title)
      router.push({ name: 'WaitEditPost', params: { id: post.id, title: post.title, section: post.sectionName }})
    }

return {
      post,
      html,
      editPost
    }
  }
})
</script>