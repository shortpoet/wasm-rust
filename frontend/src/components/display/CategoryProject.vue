<template>
  <div style="display: flex; flex-direction: row; justify-content: space-between">
    <a data-test="project" @click="toProject" class="panel-block" style="flex-grow: 2">
      <div>
        <a>{{ project.name }}</a>
        <div>{{ project.category }}</div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IProject } from "../../interfaces/IProject";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";

export default defineComponent({

  props: {
    project: {
      type: Object as () => IProject,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const toProject = () => {
      // colorLog('#### to show project ####')
      router.push({ name: 'WaitShowProject', params: {id: props.project.id, name: props.project.name}})
    }

    return {
      toProject
    }
  }
})
</script>
