<template>
  <div class="project-viewer">
    <div class="message is-info is-marginless">
      <div class="message-header" >
        <p><span class="header-text has-text-primary">Project Name:</span> <span class="header-text header-highlight">{{ project.name }}</span></p>
        <button id="display-toggle" @click="showBody = !showBody" v-if="showBody" class="compress-icon button is-rounded"><i class="fas fa-compress-alt"></i></button>
        <button id="display-toggle" @click="showBody = !showBody" v-else class="expand-icon button is-rounded"><i class="fas fa-expand-alt"></i></button>
        <p class="header-right"><span class="header-text has-text-primary">Project Category:</span> <span class="header-text header-highlight">{{ project.categoryName }}</span></p>
      </div>
      <div class="message-body" v-if="showBody">
        <p>Project by section (default all)</p>
      </div>
    </div>
    <nav class="control-panel is-primary panel" v-if="showBody">
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
    <div class="project-section-container">
      <ProjectSection
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :project-name="project.name"
        :category-name="categoryName"
      />
    </div>
  </div>

  <teleport to="#modal" v-if="sectionModal.visible">
    <component :is="component" :modal="sectionModal"/>
  </teleport>

</template>

<script lang="ts">
import { defineComponent, ref, computed, markRaw } from 'vue'
import { useStore, POST_STORE_SYMBOL, PROJECT_STORE_SYMBOL } from '../../store'
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
import { useModal } from '../../composables/useModal'
import NewSection from '../input/NewSection.vue'
import { ISession, Session } from '../../store/session/session.interface'
import { ProjectStore } from '../../store/project/project.store'

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
    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore

    const showBody = ref(true)

    const router = useRouter()
    const sectionModal = useModal('new-section')

    if (!postStore.getState().records.loaded) {
      await postStore.fetchRecords()
    }    
    const selectedSection = ref<ISection['name']>()
    // colorLog(JSON.stringify(route.params), 0)
    const project: IProject = await postStore.fetchPostsByProject(route.params.name as string)

    // need to add this call else projectstore used by session is empty 
    // so no project to correlate to name
    await projectStore.fetchRecords()
    const session: ISession = new Session(project.name, project.categoryName, projectStore)
    console.log(session);



    const categoryName = project.categoryName
    const sectionNames: ISection['name'][] = project.sections.map(p => p.name).concat(['all']);
    const sections = computed(() => project.sections.filter(section => {
      return selectedSection.value ? section.name == selectedSection.value : true
    }))
    const setSection = (section: ISection['name']) => {
      selectedSection.value = section == 'all' ? '' : section
    }
    const newSection = () => {
      console.log("on new section");
      sectionModal.component.value = markRaw(NewSection)
      sectionModal.showModal()

    }

    return {
      showBody,
      categoryName,
      project,
      setSection,
      sectionNames,
      selectedSection,
      sections,
      newSection,
      sectionModal,
      component: sectionModal.component
    }
  }
})
</script>
<style lang="scss">
</style>