<template>
  <div class="new-post-container" v-if="loaded">
    <div class="selector-container field">
      <div class="control">
        <BaseSelector
          :itemType="'type'"
          :options="['intro', 'code', 'function']"
          :name="'Type Options'"
          :small="true"
          :modelValue="selectedType"
          :default-value="'code'"
          @update:modelValue="onUpdateSelect"
        />
        <!-- <BaseSelector
          :itemType="'category'"
          :options="['browser', 'deno', 'faas', 'nodejs', 'rust', 'ssvm', 'tencentcloud']"
          :name="'Category Options'"
          :small="true"
          :modelValue="selections.category"
          :default-value="'nodejs'"
          @update:modelValue="onUpdateSelect"
        /> -->
      </div>
    </div>
    <PostWriter :post="post" @save="save"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, watch } from 'vue'
import BaseSelector from '../common/BaseSelector.vue'
import PostWriter from './PostWriter.vue'
import { IPost } from '../../interfaces/IPost'
import moment from 'moment'


import { useStore } from '../../store'
import { useRouter, useRoute } from 'vue-router'
import { colorLog } from '../../utils/colorLog'
import { ICategoryName } from '../../interfaces/ICategory'
import { ICreatePost } from '../../interfaces/ICreatePost'
import { IProject } from '../../interfaces/IProject'

export default defineComponent({
  name: 'NewPost',
  components: {
    BaseSelector,
    PostWriter
  },
  setup () {
    
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const loaded = computed(() => store.getState().projects.loaded)
    // const selections: Ref<{[key: string]: string }> = ref({
    //   type: '',
    //   category: ''
    // })
    // const title = computed(() => `${project}-${selections.value.type}`)

    const selectedType = ref('')
    let projectName
    let project: IProject

    if (!store.getState().projects.currentId) {
      if (!store.getState().projects.loaded) {
        store.fetchProjects()
      }
      const allProjects = store.getState().projects.ids.reduce<IProject[]>((accumulator, id) => {
        const project = store.getState().projects.all[id]
        return accumulator.concat(project)
      }, [])
      project = allProjects.filter(project => project.name == route.params.name)[0]
      store.setCurrentProject(project.id)
    } else {
      project = store.getState().projects.all[store.getState().projects.currentId as string]
    }
    
    const title = computed(() => `${project.name}-${selectedType.value}`)

    const post: Ref<ICreatePost> = computed(() => ({      
      // set id to -1 to represent post that has not yet been created in db
      title: title.value,
      markdown: '## New Post\nEnter your post here...',
      html: '',
      created: moment(),
      type: selectedType.value,
      projectId: parseInt(store.getState().projects.currentId as string),
      categoryId: parseInt(project.categoryId.toString())
    }))


    const save = async (post: ICreatePost) => {
      console.log('save');
      console.log(post);
      
      await store.createPost(post)
      router.push('/')
    }

    const onUpdateSelect = (e: any) => {
      // selections.value[`${e.type}`] = e.value
      selectedType.value = e.value
    }
    
    return {
      // selections,
      post,
      save,
      onUpdateSelect,
      selectedType,
      loaded
    }
  }
})
</script>
