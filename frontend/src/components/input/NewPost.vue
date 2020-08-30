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
          @update:modelValue="onUpdateType"
        />
        <BaseSelector
          :itemType="'section'"
          :options="sections"
          :name="'Category Options'"
          :small="true"
          :modelValue="selectedSection"
          :default-value="sections[0]"
          @update:modelValue="onUpdateSection"
        />
      </div>
    </div>
    <PostWriter :post="post" @save="save" />
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
    
    const selectedType = ref('')
    const project = await postStore.fetchPostsByProject(route.params.name as string)
    const sections = project.sections.map(s => s.name)
    const selectedSection = ref(sections[0])
    const title = computed(() => `${route.params.name}-${selectedType.value}`)
    const sectionComputed = computed(() => selectedSection.value)
    
    const post: Ref<IPost> = computed(() => ({
      // set id to -1 to represent post that has not yet been created in db
      id: -1,
      title: title.value,
      markdown: '## New Post\nEnter your post here...',
      html: '',
      created: moment(),
      type: selectedType.value,
      sectionName: sectionComputed.value,
      projectName: project.name,
      categoryName: projectStore.categoryName as ICategoryName
    }))

    const save = async (post: ICreatePost) => {
      console.log('save');
      await postStore.createRecord(post)
      router.push('/')
    }

    const onUpdateType = (e: any) => {
      selectedType.value = e.value
    }
    const onUpdateSection = (e: any) => {
      selectedSection.value = e.value
    }
    
    return {
      sections,
      post,
      save,
      onUpdateType,
      onUpdateSection,
      selectedSection,
      selectedType,
      loaded
    }
  }
})
</script>
