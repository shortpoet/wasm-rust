<template>
  <div class="section-viewer">
    <div class="project-section-container">
      <ProjectSection
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :project-name="projectName"
        :category-name="categoryName"
        @delete-section="onDeleteSection"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ProjectSection from './ProjectSection.vue'
import { ISection } from '../../interfaces/ISection'

export default defineComponent({
  name: 'ProjectViewer',
  components: {
    ProjectSection
  },
  props: {
    sections: {
      type: Array as () => ISection[],
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    }
  },
  emits: ['delete-section'],
  setup(props, ctx) {
    return {
      onDeleteSection: () => ctx.emit('delete-section')
    }
  }
})
</script>
<style lang="scss">
</style>