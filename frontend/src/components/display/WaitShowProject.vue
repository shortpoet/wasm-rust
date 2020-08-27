<template>
  <Suspense>
    <template #default>
      <ProjectViewer />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProjectViewer from './ProjectViewer.vue'
import Progress from '../common/Progress.vue'
export default defineComponent({
  name: 'WaitShowProject',
  props: {
    id: {
      type: String
    }
  },
  components: {
    ProjectViewer,
    Progress
  }
})
</script>