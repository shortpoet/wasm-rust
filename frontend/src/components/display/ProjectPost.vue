<template>
  <div class="project-container" style="display: flex; flex-direction: column; justify-content: space-between">
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <a data-test="post" @click="toPost" class="panel-block" style="flex-grow: 2">
        <div>
          <a>{{ post.title }}</a>
          <div>{{ post.created.format('Do MMM HH:mm:ss') }}</div>
        </div>
      </a>
    </div>
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p>Rust Message</p>
        <button class="button is-pulled-right is-rounded" @click.prevent="onRust" style="">
          <i class="fa fa-cog"></i>
        </button>
      </div>
      <div class="message-body">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IPost } from "../../interfaces/IPost";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";
import { rustAxios } from "../../ajax";

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
