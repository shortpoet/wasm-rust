<template>
  <Suspense>
    <template #default>
      <NewPost />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NewPost from '../input/NewPost.vue'
import Progress from '../common/Progress.vue'
export default defineComponent({
  name: 'WaitShowPost',
  props: {
    id: {
      type: String
    }
  },
  components: {
    NewPost,
    Progress
  }
})
</script>