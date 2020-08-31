<template>
  <div class="message is-info is-marginless">
    <div class="message-header">
      <span class="header-highlight"><span class="has-text-primary">Post Title: </span><span class="header-highlight">{{ post.title }}</span></span>
      <div class="post-control-buttons">

        <button id="display-toggle" @click="showBody = !showBody" v-if="showBody" class="compress-icon button is-rounded"><i class="fas fa-compress-alt"></i></button>
        <button id="display-toggle" @click="showBody = !showBody" v-else class="expand-icon button is-rounded"><i class="fas fa-expand-alt"></i></button>

        <button class="header-highlight-button button is-rounded" @click.prevent="toPost">
          <i class="fa fa-external-link-alt"></i>
        </button>

        <button v-if="devEnv" class="header-highlight-button button is-rounded" @click.prevent="deletePost">
          <i class="fa fa-trash"></i>
        </button>

      </div>
    </div>
    <div class="message-body" v-if="showBody ">
      <div class="intro-post" v-if="post.type == 'intro'" v-html="html"></div>
      <div class="code-post" v-if="post.type == 'code'" v-html="html"></div>
      <div class="output-post"  v-if="post.type == 'function'">
        <hello-rust :post-html="html"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { IPost } from "../../interfaces/IPost";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";
import { useMarkdown } from "../../composables/useMarkdown";
import  HelloRust from '../rust/hello-rust.vue'
import { PostStore } from "../../store/post/post.store";
import { useStore, POST_STORE_SYMBOL } from "../../store";

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
  emits: ['delete-post'],
  setup(props, ctx) {
    const router = useRouter();
    const devEnv = computed(() => process.env.NODE_ENV != 'production')

    const showBody = ref(true)
    const update = useMarkdown().update
    const html = ref()
    if (props.post.html) {
      html.value = update(props.post.html)
    }
    const postStore: PostStore = useStore<PostStore>(POST_STORE_SYMBOL) as PostStore

    const toPost = () => {
      colorLog("#### to show post ####");
      router.push({
        name: "WaitShowPost",
        params: { id: props.post.id, title: props.post.title, section: props.post.sectionName },
      });
    };
    
    const deletePost = () => {
      colorLog("#### delete post ####");
      postStore.deleteRecord(props.post)
      ctx.emit('delete-post')
    }

    return {
      toPost,
      html,
      showBody,
      deletePost,
      devEnv
    };
  },
});
</script>
