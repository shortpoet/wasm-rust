<template>
  <div class="project-viewer">
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p>Project Name: {{ project.name }}</p>
        <p>Project Category: {{ project.category }}</p>
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
      <a class="panel-block">
        <span class="control-element">
          <button class="button is-pulled-right is-rounded" @click.prevent="newSection" style="">
            <i class="fa fa-edit"></i>
          </button>
          <p>New Section</p>
        </span>
      </a>
    </nav>
    <ProjectSection v-for="section in sections" :key="section.id" :section="section"/>
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
  async setup() {
    const route = useRoute()
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore
    const router = useRouter()


    if (!postStore.getState().records.loaded) {
      await postStore.fetchRecords()
    }    
    const selectedSection = ref<ISection['name']>()
    colorLog(JSON.stringify(route.params), 0)
    const project: IProject = await postStore.fetchPostsByProject(route.params.name as string)
    console.log(project);
    
    const sectionNames: ISection['name'][] = project.sections.map(p => p.name).concat(['all']);

    const sections = computed(() => project.sections.filter(section => {
      // console.log(post);
      return selectedSection.value ? section.name == selectedSection.value : true
    }))

    const setSection = (section: ISection['name']) => {
      selectedSection.value = section == 'all' ? '' : section
    }

    const newSection = () => {
      // router.push({ name: 'NewPost', params: {id: project.id, name: project.name, category: project.category, categoryId: project.categoryId}})
    }
    return {
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