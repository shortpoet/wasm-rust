<template>
  <Suspense>
    <template #default>
      <PostEditor />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PostEditor from './PostEditor.vue'
import Progress from '../common/Progress.vue'
export default defineComponent({
  name: 'WaitShowPost',
  components: {
    PostEditor,
    Progress
  }
})
</script>