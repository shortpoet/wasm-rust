<template>
  <div class="columns">
    <div class="column"/>
    <div class="column is-two-thirds">
      <a data-test="can-edit" @click="toPost" class="button is-pulled-right is-rounded is-link">
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
import { useStore } from '../../store'
import { useMarkdown } from '../../composables/useMarkdown'

import marked from "marked"
import hljs from "highlight.js"

import { useRoute, useRouter } from 'vue-router'
import { IPost } from '../../interfaces/IPost'
import { colorLog } from '../../utils/colorLog'

export default defineComponent({
  name: 'PostViewer',
  components: {
  },
  async setup(props) {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()

    // on reload there is no pushed id or loaded posts param so must do 'expensive' search instead

    if (!store.getState().posts.loaded) {
      await store.fetchPosts()
    }

    let post: IPost;
    if (!route.params.id) {
      const allPosts = store.getState().posts.ids.reduce<IPost[]>((accumulator, id) => {
        const post = store.getState().posts.all[id]
        return accumulator.concat(post)
      }, [])
      post = allPosts.filter(post => post.title == route.params.title)[0]
    } else {
      post = store.getState().posts.all[route.params.id as string]
    }
    
    const update = useMarkdown().update
    const html = ref()
    if (post.html) {
      html.value = update(post.html)
    }
    const toPost = () => {
      colorLog('#### to edit post ####')
      store.setCurrentPost(post.id)
      router.push({ name: 'WaitEditPost', params: { id: post.id, title: post.title }})
    }

return {
      post,
      html,
      toPost
    }
  }
})
</script>