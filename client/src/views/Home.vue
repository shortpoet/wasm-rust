<template>
  <Suspense>
    <template #default>
      <MainLayout />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainLayout from './MainLayout.vue'
import Progress from '../components/common/Progress.vue'

export default defineComponent({
  components: { 
    MainLayout,
    Progress
  },
  name: 'Home'
})
</script>
