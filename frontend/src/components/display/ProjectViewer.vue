<template>
  <div class="columns">
    <div class="column"/>
    <div class="column is-two-thirds">
      <a data-test="can-edit" @click="toProject" class="button is-pulled-right is-rounded is-link">
        <i class="fas fa-edit" />
      </a>
      <h1>
        Project Name is: {{ project.name }}
      </h1>
      <div class="project-body" v-html="html"></div>
    </div>
    <div class="column"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '../../store'
// import { useMarkdown } from '../../composables/useMarkdown'

// import marked from "marked"
// import hljs from "highlight.js"

import { useRoute, useRouter } from 'vue-router'
import { IProject } from '../../interfaces/IProject'
import { colorLog } from '../../utils/colorLog'

export default defineComponent({
  name: 'ProjectViewer',
  components: {
  },
  async setup() {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()

    // on reload there is no pushed id or loaded projects param so must do 'expensive' search instead

    if (!store.getState().projects.loaded) {
      await store.fetchProjects()
    }

    let project: IProject;
    if (!route.params.id) {
      const allProjects = store.getState().projects.ids.reduce<IProject[]>((accumulator, id) => {
        const project = store.getState().projects.all[id]
        return accumulator.concat(project)
      }, [])
      project = allProjects.filter(project => project.title == route.params.title)[0]
    } else {
      project = store.getState().projects.all[route.params.id as string]
    }
    
    // const markdown = useMarkdown().update
    // const options: marked.MarkedOptions =  {
    //   // takes function that return code with syntax hightlighting
    //   highlight: (code: string) => hljs.highlightAuto(code).value
    // }
    // const update = (value: string) => marked.parse(value, options)
    // const html = ref()
    // if (project.html) {
    //   html.value = update(project.html)
    // }
    const toProject = () => {
      colorLog('#### to edit project ####')
      router.push({ name: 'WaitEditProject', params: { id: project.id, name: project.name }})
    }

return {
      project,
      // markdown,
      // html,
      toProject
    }
  }
})
</script>