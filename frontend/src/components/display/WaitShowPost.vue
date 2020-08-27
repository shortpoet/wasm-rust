<template>
  <Suspense>
    <template #default>
      <PostViewer />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PostViewer from './PostViewer.vue'
import Progress from '../common/Progress.vue'
export default defineComponent({
  name: 'WaitShowPost',
  components: {
    PostViewer,
    Progress
  }
})
</script>