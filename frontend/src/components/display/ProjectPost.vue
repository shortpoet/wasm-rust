<template>
  <ProjectPostSection :post="post"/>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IPost } from "../../interfaces/IPost";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";
import { rustAxios } from "../../ajax";
import ProjectPostSection from './ProjectPostSection.vue'

export default defineComponent({
  components: {
    ProjectPostSection
  },
  props: {
    post: {
      type: Object as () => IPost,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const message = ref();
    const onRust = async () => {
      colorLog('rust message', 1)
      message.value = await rustAxios('get', 'say', { name:'shortpoet' })
    }
    const toPost = () => {
      colorLog('#### to show post ####')
      router.push({ name: 'WaitShowPost', params: {id: props.post.id, title: props.post.title}})
    }

    return {
      onRust,
      message,
      toPost
    }
  }
})
</script>
