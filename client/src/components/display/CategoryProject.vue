<template>
  <div style="display: flex; flex-direction: row; justify-content: space-between">
    <a data-test="project" @click="toProject" class="panel-block" style="flex-grow: 2">
      <div>
        <a>{{ project.name }}</a>
        <div>{{ project.categoryName }}</div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IProject } from "../../interfaces/IProject";
import { useStore, PROJECT_STORE_SYMBOL } from "../../store";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";
import { ProjectStore } from "../../store/project/project.store";

export default defineComponent({

  props: {
    project: {
      type: Object as () => IProject,
      required: true
    }
  },
  setup(props) {
    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore
    
    const router = useRouter()
    const toProject = () => {
      // colorLog('#### to show project ####')
      projectStore.setCurrentId(props.project.id)
      projectStore.setCategoryName(props.project.categoryName)
      router.push({ name: 'WaitShowProject', params: {category: props.project.categoryName, id: props.project.id, name: props.project.name}})

    }

    return {
      toProject
    }
  }
})
</script>
