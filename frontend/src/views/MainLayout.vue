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
import CategoryProject from '../components/display/CategoryProject.vue'
import { ref, computed, defineComponent } from 'vue'
import { useStore } from '../store'

import { colorLog } from '../utils/colorLog'
import { ICategoryName } from '../interfaces/ICategory'
import { IProject } from '../interfaces/IProject'

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
      await store.fetchProjects()
    }
    
    const allProjects = store.getState().projects.ids.reduce<IProject[]>((accumulator, id) => {
      const post = store.getState().projects.all[id]
      return accumulator.concat(post)
    }, [])

    const projects = computed(() => allProjects.filter(post => {
      return post.category == selectedCategory.value
    }))

    const setCategory = (category: ICategoryName) => {
      selectedCategory.value = category
    }
    colorLog('projects')
    
    return {
      categories,
      selectedCategory,
      setCategory,
      projects
    }
  }
})
</script>