<template>
  <Suspense>
    <template #default>
      <PostLayout />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PostLayout from './PostLayout.vue'
import Progress from '../components/common/Progress.vue'

export default defineComponent({
  components: { 
    PostLayout,
    Progress
  },
  name: 'Home'
})
</script>
