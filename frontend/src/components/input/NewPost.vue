<template>
  <div class="new-post-container">
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
        choose from sections or make new section
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


import { useStore, POST_STORE_SYMBOL, PROJECT_STORE_SYMBOL } from '../../store'
import { useRouter, useRoute } from 'vue-router'
import { colorLog } from '../../utils/colorLog'
import { ICategoryName } from '../../interfaces/ICategory'
import { ICreatePost } from '../../interfaces/ICreatePost'
import { IProject } from '../../interfaces/IProject'
import { PostStore } from '../../store/post/post.store'
import { ProjectStore } from '../../store/project/project.store'
import { PROJECTS } from '../../store/project/constants'

export default defineComponent({
  name: 'NewPost',
  components: {
    BaseSelector,
    PostWriter
  },
  async setup () {
    
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore
    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore
    const route = useRoute()
    const router = useRouter()
    const loaded = computed(() => postStore.getState().records.loaded)
    colorLog('new post')
    
    // const selections: Ref<{[key: string]: string }> = ref({
    //   type: '',
    //   category: ''
    // })
    // const title = computed(() => `${project}-${selections.value.type}`)

    const selectedType = ref('')
    let projectName
    let project: IProject

    // if(!loaded.value) {
    //   // await postStore.fetchPostsByProject(route.params.name as string)
    // }
    const title = computed(() => `${route.params.name}-${selectedType.value}`)

    const post: Ref<ICreatePost> = computed(() => ({      
      // set id to -1 to represent post that has not yet been created in db
      title: title.value,
      markdown: '## New Post\nEnter your post here...',
      html: '',
      created: moment(),
      type: selectedType.value,
      projectId: parseInt(projectStore.getState().records.currentId as string),
      categoryId: projectStore.categoryId as number
    }))


    const save = async (post: ICreatePost) => {
      console.log('save');
      await postStore.createRecord(post)
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
