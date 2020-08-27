<template>
  <div class="message is-info is-marginless">
    <div class="message-header">
      <p>Projects</p>
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
    <CategoryProject v-for="project in projects" :key="project.id" :project="project"/>
  </nav>
</template>

<script lang="ts">
import { ICategory } from '../interfaces/ICategory'
import { IPost } from '../interfaces/IPost'
import CategoryProject from '../components/display/CategoryProject.vue'
import { ref, computed, defineComponent } from 'vue'
import { useStore } from '../store'

import moment from 'moment'


import { colorLog } from '../utils/colorLog'
import { ICategoryName } from '../interfaces/ICategory'

export default defineComponent({
  components: {
    CategoryProject
  },
  async setup() {
    const categories: ICategoryName[] = ['browser', 'deno', 'faas', 'nodejs', 'rust', 'ssvm', 'tencentcloud']

    // ref is generic type
    const selectedCategory = ref<ICategoryName>('nodejs')

    const store = useStore()
    
    if (!store.getState().projects.loaded) {
      console.log('post layout');
      await store.fetchProjects()
    }
    
    // console.log(users);
    // this uses the mapper to return with O(1) instead of O(n) by searching by id insead of looping over an array
    const allProjects = store.getState().projects.ids.reduce<IPost[]>((accumulator, id) => {
      const post = store.getState().projects.all[id]
      return accumulator.concat(post)
    }, [])

    // computed automatically recalculates and updates the DOM anytime a reactive reference changes 
    const projects = computed(() => allProjects.filter(post => {
      console.log(post);
      
      return post.category == selectedCategory.value
    }))
    const setCategory = (category: ICategoryName) => {
      selectedCategory.value = category
    }
    colorLog('projects')
    console.log(projects.value);
    
    return {
      categories,
      selectedCategory,
      setCategory,
      projects
    }
  }
})
</script>