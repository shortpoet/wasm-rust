<template>
  <div class="columns">
    <div class="column"/>
    <div class="column is-two-thirds">
      <router-link data-test="can-edit" :to="to" class="button is-pulled-right is-rounded is-link">
        <i class="fas fa-edit" />
      </router-link>
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
import { useStore } from '../store'
import { useMarkdown } from '../composables/useMarkdown'

import marked from "marked"
import hljs from "highlight.js"

import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'PostViewer',
  components: {
  },
  async setup() {
    const route = useRoute()
    const store = useStore()

    if (!store.getState().posts.loaded) {
      await store.fetchPosts()
    }

    const post = store.getState().posts.all[route.params.id as string]
    const markdown = useMarkdown().update
    const options: marked.MarkedOptions =  {
      // takes function that return code with syntax hightlighting
      highlight: (code: string) => hljs.highlightAuto(code).value
    }
    const update = (value: string) => marked.parse(value, options)
    const html = ref()
    if (post.html) {
      html.value = update(post.html)
    }

return {
      post,
      to: `/posts/${post.id}/edit`,
      markdown,
      html
    }
  }
})
</script>