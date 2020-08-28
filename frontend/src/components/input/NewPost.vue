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

    // const selections: Ref<{[key: string]: string }> = ref({
    //   type: '',
    //   category: ''
    // })
    // const title = computed(() => `${project}-${selections.value.type}`)

    const selectedType = ref('')
    const project = route.params.name
    const title = computed(() => `${project}-${selectedType.value}`)

    const post: Ref<IPost> = computed(() => ({
      // set id to -1 to represent post that has not yet been created in db
      id: -1,
      title: title.value,
      markdown: '## New Post\nEnter your post here...',
      html: '',
      created: moment(),
      project: `${project}`,
      category: `${route.params.category}` as ICategoryName
    }))


    const save = async (post: IPost) => {
      console.log('save');
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
      selectedType
    }
  }
})
</script>
