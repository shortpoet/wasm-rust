<template>
  <div class="project-viewer">
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p>Project Name: {{ project.name }}</p>
        <p>Project Category: {{ project.category }}</p>
      </div>
      <div class="message-body">
        <p>Posts by type (default all)</p>
      </div>
    </div>
    <nav class="control-panel is-primary panel">
      <p class="panel-tabs">
        <!-- define a test specific selector so that future code changes to tag, class, or id, which don't nec change functionality, don't break test eg a => div -->
        <a v-for="type in types" :key="type" data-test="type"
          :class="[ type === selectedType ? 'is-active' : '']"
          @click="setType(type)"
        >
          {{ type }}
        </a>
      </p>
      <a class="panel-block">
        <span class="control-element">
          <button class="button is-pulled-right is-rounded" @click.prevent="newPost" style="">
            <i class="fa fa-edit"></i>
          </button>
          <p>NewPost</p>
        </span>
      </a>
    </nav>
    <ProjectPost v-for="post in posts" :key="post.id" :post="post"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from '../../store'
// import { useMarkdown } from '../../composables/useMarkdown'

// import marked from "marked"
// import hljs from "highlight.js"

import { useRoute } from 'vue-router'
import { IProject } from '../../interfaces/IProject'
import { colorLog } from '../../utils/colorLog'
import { IPost } from '../../interfaces/IPost'
import ProjectPost from './ProjectPost.vue'

export default defineComponent({
  name: 'ProjectViewer',
  components: {
    ProjectPost
  },
  async setup() {
    const route = useRoute()
    const store = useStore()
    // const router = useRouter()

    // on reload there is no pushed id or loaded projects param so must do 'expensive' search instead

    if (!store.getState().projects.loaded) {
      await store.fetchProjects()
    }

    // let project: IProject;
    // if (!route.params.id) {
    //   const allProjects = store.getState().projects.ids.reduce<IProject[]>((accumulator, id) => {
    //     const project = store.getState().projects.all[id]
    //     return accumulator.concat(project)
    //   }, [])
    //   project = allProjects.filter(project => project.title == route.params.title)[0]
    // } else {
    //   project = store.getState().projects.all[route.params.id as string]
    // }
    
    const types: IPost['type'][] = ['intro']

    // ref is generic type
    const selectedType = ref<IPost['type']>()
    colorLog(JSON.stringify(route.params), 0)
    const project: IProject = await store.fetchPostsByProject(route.params.name as string)



    // computed automatically recalculates and updates the DOM anytime a reactive reference changes 
    const posts = computed(() => project.posts.filter(post => {
      console.log(post);
      return selectedType.value ? post.type == selectedType.value : true
    }))

    const setType = (type: IPost['type']) => {
      selectedType.value = type
    }
    colorLog('posts')
    console.log(posts.value);


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
    // const toProject = () => {
    //   colorLog('#### to edit post ####')
    //   router.push({ name: 'WaitEditPost', params: { id: project.id, name: project.name }})
    // }

return {
      project,
      setType,
      types,
      selectedType,
      posts
    }
  }
})
</script>
<style lang="scss">
</style>