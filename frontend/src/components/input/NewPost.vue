<template>
  <div class="new-post-container">
    <div class="selector-container field">
      <div class="control">
        <BaseSelector
          :itemType="'type'"
          :options="['intro', 'code', 'function']"
          :name="'Type Options'"
          :small="true"
          :modelValue="selections.type"
          :default-value="'code'"
          @update:modelValue="onUpdateSelect"
        />
        <BaseSelector
          :itemType="'category'"
          :options="['browser', 'deno', 'faas', 'nodejs', 'rust', 'ssvm', 'tencentcloud']"
          :name="'Category Options'"
          :small="true"
          :modelValue="selections.category"
          :default-value="'nodejs'"
          @update:modelValue="onUpdateSelect"
        />
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

    const selections: Ref<{[key: string]: string }> = ref({
      type: '',
      category: ''
    })
    const project = route.params.name
    const title = computed(() => `${project}-${selections.value.type}`)
    console.log(title.value);
    console.log(selections.value.type);
    watch(
      () => [selections.value.type, selections.value.category],
      // still a function with same signature - just a func returning string so can pass in like this
      () => {
        colorLog(`${JSON.stringify(selections.value)}`, 1)
        console.log(title.value);
        
      },
      // use optional 3rd arguement to have watch function called onMounted instead of manually copying logic in that hook
      { immediate: true }
    )
    
    

    const post: Ref<IPost> = computed(() => ({
      // set id to -1 to represent post that has not yet been created in db
      id: -1,
      title: title.value,
      markdown: '## New Post\nEnter your post here...',
      html: '',
      created: moment(),
      project: `${project}`,
      category: `${selections.value.category}` as ICategoryName
    }))

    // composition functions
    // useRouter internally use inject and provide
    // if moved to within a different context eg nested function get error
    // inject can only be used within setup function

    const router = useRouter()

    const save = async (post: IPost) => {
      console.log('save');
      
      await store.createPost(post)
      router.push('/')
    }
    const onUpdateSelect = (e: any) => {
      colorLog('update select ', 1)
      selections.value[`${e.type}`] = e.value
      console.log(selections.value[`${e.type}`]);
      
    }
    
    return {
      selections,
      post,
      save,
      onUpdateSelect
    }
  }
})
</script>
