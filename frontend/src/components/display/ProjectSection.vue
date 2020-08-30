<template>
  <div class="project-section">
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p><span class="has-text-primary">Section Name:</span> <span class="header-highlight">{{ section.name }}</span></p>
      </div>
      <div class="message-body">
        <p>Posts by type (default all)</p>
      </div>
    </div>
    <nav class="control-panel is-primary panel">
      <p class="panel-tabs">
        <!-- define a test specific selector so that future code changes to tag, class, or id, which don't nec change functionality, don't break test eg a => div -->
        <a
          v-for="type in typeNames"
          :key="type"
          data-test="type"
          :class="[ type == selectedType ? 'is-active' : '']"
          @click="setType(type)"
        >{{ type }}</a>
      </p>
      <div class="panel-block">
        <span class="control-element">
          <button class="button  is-rounded" @click.prevent="newPost" style>
            <i class="fa fa-edit"></i>
          </button>
          <p>New Post</p>
        </span>
      </div>
    </nav>
    <SectionPost v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { IPost } from "../../interfaces/IPost";
import { useRouter } from "vue-router";
import { colorLog } from "../../utils/colorLog";
import { rustAxios } from "../../ajax";
import SectionPost from "./SectionPost.vue";
import { ISection } from "../../interfaces/ISection";

export default defineComponent({
  components: {
    SectionPost,
  },
  props: {
    section: {
      type: Object as () => ISection,
      required: true,
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
  setup(props) {
    colorLog('project section')
    console.log(props.categoryName);
    
    const typeNames: IPost["type"][] = props.section.posts.map(p => p.type).concat(['all']);

    const selectedType = ref<IPost["type"]>();
    const posts = computed(() =>
      props.section.posts.filter((post) => {
        // console.log(post);
        return selectedType.value ? post.type == selectedType.value : true;
      })
    );

    const setType = (type: IPost["type"]) => {
      selectedType.value = type == "all" ? "" : type;
    };

    const router = useRouter();
    const message = ref();
    const onRust = async () => {
      colorLog("rust message", 1);
      message.value = await rustAxios("get", "say", { name: "shortpoet" });
    };
    const toPost = () => {
      colorLog("#### to show post ####");
      router.push({
        name: "WaitShowPost",
        // params: { id: props.post.id, title: props.post.title },
      });
    };
    const newPost = () => {
      router.push({ name: 'WaitNewPost', params: { name: props.projectName, category: props.categoryName }})
    }

    return {
      onRust,
      message,
      toPost,
      setType,
      typeNames,
      selectedType,
      posts,
      newPost
    };
  },
});
</script>
