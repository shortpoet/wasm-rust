<template>
  <div style="display: flex; flex-direction: row; justify-content: space-between">
    <a data-test="post" @click="toPost" class="panel-block" style="flex-grow: 2">
      <div>

        <!-- 
          exercise for listener
          title rendered correctly 
        -->

        <a>{{ post.title }}</a>
        <div>{{ post.created.format('Do MMM HH:mm:ss') }}</div>
      </div>
    </a>
    <button class="button is-pulled-right is-rounded" @click.prevent="onDelete" style="">
      <i class="fa fa-trash"></i>
    </button>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IPost } from "../../interfaces/IPost";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";

export default defineComponent({

  props: {
    post: {
      type: Object as () => IPost,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const onDelete = () => store.deletePost(props.post.id.toString())
    const toPost = () => {
      colorLog('#### to show post ####')
      router.push({ name: 'WaitShowPost', params: {id: props.post.id, title: props.post.title}})
    }

    return {
      onDelete,
      toPost
    }
  }
})
</script>
