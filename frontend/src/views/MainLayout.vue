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
import { ref, computed, defineComponent, ComputedRef } from 'vue'
import { useStore, PROJECT_STORE_SYMBOL } from '../store'

import { colorLog } from '../utils/colorLog'
import { ICategoryName } from '../interfaces/ICategory'
import { IProject } from '../interfaces/IProject'
import { ProjectStore } from '../store/project/project.store'
import { PROJECTS } from '../store/project/constants'
import { Session } from '../store/session/session.interface'

export default defineComponent({
  components: {
    CategoryProject
  },
  async setup() {
    const categories: ICategoryName[] = ['browser', 'deno', 'faas', 'nodejs', 'rust', 'ssvm', 'tencentcloud']

    const selectedCategory = ref<ICategoryName>('nodejs')

    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore
    console.log(projectStore);
    

    if (!projectStore.getState().records.loaded) {
      await projectStore.fetchRecords()
    }
    
    const allProjects: IProject[] = await projectStore.loadRecords(PROJECTS)

    const projects: ComputedRef<IProject[]> = computed(() => allProjects.filter(project => {
      return project.categoryName == selectedCategory.value
    }))

    const setCategory = (category: ICategoryName) => {
      selectedCategory.value = category
    }
    colorLog('projects')
    // console.log(projects.value);
    // console.log(projectStore.getRecordById('hello-rust'));
    
    const session = new Session('a', 'b', projectStore)
    session.endSession()

    return {
      categories,
      selectedCategory,
      setCategory,
      projects
    }
  }
})
</script>