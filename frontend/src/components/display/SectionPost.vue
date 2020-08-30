<template>
  <div class="message is-info is-marginless">
    <div class="message-header" @click="showBody = !showBody">
      <span class="header-highlight"><span class="has-text-primary">Post Title: </span><span class="header-highlight">{{ post.title }}</span></span>
      <button class="header-highlight-button button is-rounded" @click.prevent="toPost">
        <i class="fa fa-external-link-alt"></i>
      </button>
    </div>
    <div class="message-body" v-if="showBody ">
      <hello-rust :code="html"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IPost } from "../../interfaces/IPost";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";
import { useMarkdown } from "../../composables/useMarkdown";
import  HelloRust from '../rust/hello-rust.vue'

export default defineComponent({
  components: {
    HelloRust
  },
  props: {
    post: {
      type: Object as () => IPost,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const showBody = ref(true)
    const update = useMarkdown().update
    const html = ref()
    if (props.post.html) {
      html.value = update(props.post.html)
    }

    const toPost = () => {
      colorLog("#### to show post ####");
      router.push({
        name: "WaitShowPost",
        params: { id: props.post.id, title: props.post.title },
      });
    };

    return {
      toPost,
      html,
      showBody
    };
  },
});
</script>
