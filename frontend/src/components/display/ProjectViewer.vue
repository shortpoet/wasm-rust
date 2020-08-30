<template>
  <div class="project-viewer">
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p><span class="has-text-primary">Project Name:</span> <span class="header-highlight">{{ project.name }}</span></p>
        <p><span class="has-text-primary">Project Category:</span> <span class="header-highlight">{{ project.category }}</span></p>
      </div>
      <div class="message-body">
        <p>Project by section (default all)</p>
      </div>
    </div>
    <nav class="control-panel is-primary panel">
      <p class="panel-tabs">
        <!-- define a test specific selector so that future code changes to tag, class, or id, which don't nec change functionality, don't break test eg a => div -->
        <a v-for="section in sectionNames" :key="section" data-test="section"
          :class="[ section == selectedSection ? 'is-active' : '']"
          @click="setSection(section)"
        >
          {{ section }}
        </a>
      </p>
      <div class="panel-block">
        <span class="control-element">
          <button class="button is-rounded" @click.prevent="newSection" style="">
            <i class="fa fa-edit"></i>
          </button>
          <span>New Section</span>
        </span>
      </div>
    </nav>
    <ProjectSection
      v-for="section in sections"
      :key="section.id"
      :section="section"
      :project-name="project.name"
      :category-name="categoryName"
    />
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
import ProjectSection from './ProjectSection.vue'
import { PostStore } from '../../store/post/post.store'
import { ISection } from '../../interfaces/ISection'

export default defineComponent({
  name: 'ProjectViewer',
  components: {
    ProjectSection
  },
  props: {
  },
  async setup() {
    const route = useRoute()
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore
    const router = useRouter()

    if (!postStore.getState().records.loaded) {
      await postStore.fetchRecords()
    }    
    const selectedSection = ref<ISection['name']>()
    // colorLog(JSON.stringify(route.params), 0)
    const project: IProject = await postStore.fetchPostsByProject(route.params.name as string)
    const categoryName = project.categoryName
    const sectionNames: ISection['name'][] = project.sections.map(p => p.name).concat(['all']);
    const sections = computed(() => project.sections.filter(section => {
      return selectedSection.value ? section.name == selectedSection.value : true
    }))
    const setSection = (section: ISection['name']) => {
      selectedSection.value = section == 'all' ? '' : section
    }
    const newSection = () => {
      // router.push({ name: 'NewPost', params: {id: project.id, name: project.name, category: project.category, categoryId: project.categoryId}})
    }
    return {
      categoryName,
      project,
      setSection,
      sectionNames,
      selectedSection,
      sections,
      newSection
    }
  }
})
</script>
<style lang="scss">
</style>