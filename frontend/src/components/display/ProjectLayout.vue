<template>
  <div class="message is-info is-marginless">
    <div class="message-header">
      <p>Posts</p>
    </div>
  </div>
  <nav class="is-primary panel">
    <p class="panel-tabs">
      <!-- define a test specific selector so that future code changes to tag, class, or id, which don't nec change functionality, don't break test eg a => div -->
      <a v-for="category in categories" :key="category" data-test="category"
        :class="[ category === selectedCategory ? 'is-active' : '']"
        @click="setCategory(category)"
      >
        {{ category }}
      </a>
    </p>
    <CategoryPost v-for="post in posts" :key="post.id" :post="post"/>
  </nav>
</template>

<script lang="ts">
import { ICategory } from '../../interfaces/ICategory'
import { IPost } from '../../interfaces/IPost'
import CategoryPost from '../components/display/CategoryPost.vue'
import { ref, computed, defineComponent } from 'vue'
import { useStore } from '../../store'

import moment from 'moment'


import { colorLog } from '../../utils/colorLog'
import { ICategoryName } from '../../interfaces/ICategory'
import { IProject } from '../../interfaces/IProject'

export default defineComponent({
  components: {
    CategoryPost
  },
  props: {
    project: {
      type: Object as () => IProject
    }
  },
  async setup(props) {
    const types: IPost['type'][] = ['intro']

    // ref is generic type
    const selectedType = ref<IPost['type']>()

    const store = useStore()

    if (!store.getState().posts.loaded) {
      console.log('post layout');
      await store.fetchPostsByProject(props.project.name)
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
      
      return post.category == selectedCategory.value
    }))
    // const posts = computed(() => allPosts.filter(post => {
    //   colorLog("post")
    //   // Object.entries(post).forEach(([k,v]) => colorLog(`${k} is ${v}: ${typeof v}`))
    //   // colorLog(JSON.stringify(post))
    //   if (
    //     selectedCategory.value == 'today' &&
    //     post.created.isAfter(moment().subtract(1, 'day'))
    //   ) {
    //     return true
    //   }
    //   if (
    //     selectedCategory.value == 'this week' &&
    //     post.created.isAfter(moment().subtract(1, 'week'))
    //   ) {
    //     return true
    //   }
    //   if (
    //     selectedCategory.value == 'this month' &&
    //     post.created.isAfter(moment().subtract(1, 'month'))
    //   ) {
    //     return true
    //   }
    //   return false
    // })
    // )
    const setCategory = (category: ICategoryName) => {
      selectedCategory.value = category
    }
    colorLog('posts')
    console.log(posts.value);
    
    return {
      categories,
      selectedCategory,
      setCategory,
      posts
    }
  }
})
</script>