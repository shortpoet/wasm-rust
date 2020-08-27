<template>
  <div class="message is-info is-marginless">
    <div class="message-header">
      <p>{{ typeName }}</p>
    </div>
  </div>
  <nav class="is-primary panel">
    <p class="panel-tabs">
      <!-- define a test specific selector so that future code changes to tag, class, or id, which don't nec change functionality, don't break test eg a => div -->
      <a v-for="type in types" :key="type" data-test="type"
        :class="[ type === selectedType ? 'is-active' : '']"
        @click="setType(type)"
      >
        {{ type }}
      </a>
    </p>
    <CategoryPost v-for="post in posts" :key="post.id" :post="post"/>
  </nav>
</template>

<script lang="ts">
import CategoryPost from '../components/display/CategoryPost.vue'
import { ref, computed, defineComponent } from 'vue'
import { useStore } from '../../store'

import moment from 'moment'
import { IPost } from '../../interfaces/IPost'
import { colorLog } from '../../utils/colorLog'

export default defineComponent({
  components: {
    CategoryPost
  },
  props: {
    typeName: {
      type: String,
      required: true
    }
  },
  async setup(props) {
    const selectedType = ref()

    const store = useStore()

    if (!store.getState().posts.loaded) {
      console.log('type selector');
      await store.fetchPosts()
    }
    
    // console.log(users);
    // this uses the mapper to return with O(1) instead of O(n) by searching by id insead of looping over an array
    const allPosts = store.getState().posts.ids.reduce<IPost[]>((accumulator, id) => {
      const post = store.getState().posts.all[id]
      return accumulator.concat(post)
    }, [])

    // computed automatically recalculates and updates the DOM anytime a reactive reference changes 
    const posts = computed(() => allPosts.filter(post => {
      console.log(post);
      return post[props.typeName] == selectedType.value
    }))

    const types = posts.value.map(p => p.type)
    const setType = (type: string) => {
      selectedType.value = type
    }
    colorLog('posts')
    console.log(posts.value);
    
    return {
      types,
      selectedType,
      setType,
      posts
    }
  }
})
</script>