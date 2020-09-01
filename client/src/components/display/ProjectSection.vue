<template>
  <div class="project-section">
    <div class="message is-info is-marginless">
      <div class="message-header">
        <p><span class="header-text has-text-primary">Section Name:</span> <span class="header-text header-highlight">{{ section.name }}</span></p>
        <button id="display-toggle" @click="showBody = !showBody" v-if="showBody" class="compress-icon button is-rounded"><i class="fas fa-compress-alt"></i></button>
        <button id="display-toggle" @click="showBody = !showBody" v-else class="expand-icon button is-rounded"><i class="fas fa-expand-alt"></i></button>
      </div>
      <div class="message-body" v-if="showBody">
        <p>Posts by type (default all)</p>
      </div>
    </div>
    <nav class="control-panel is-primary panel" v-if="showBody">
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
        <span class="control-element">
          <button class="button  is-rounded" @click.prevent="updatePosts" style>
            <i class="fa fa-trash"></i>
          </button>
          <p>Delete Section</p>
        </span>
      </div>
    </nav>
    <SectionPost v-for="post in posts" :key="post.id" :post="post" @delete-post="updatePosts"/>
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
import { ProjectStore } from "../../store/project/project.store";
import { useStore, PROJECT_STORE_SYMBOL } from "../../store";

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
  emits: ['update-posts'],
  setup(props, ctx) {
    // colorLog('project section')
    // console.log(props.categoryName);
    const showBody = ref(true)
    
    const typeNames: IPost["type"][] = props.section.posts.map(p => p.type).concat(['all']);

    const selectedType = ref<IPost["type"]>();
    const posts = computed(() =>
      props.section.posts.filter((post) => {
        // console.log(post);
        return selectedType.value ? post.type == selectedType.value : true;
      })
    );
    console.log(posts);
    
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
      router.push({ name: 'WaitNewPost', params: { name: props.projectName, category: props.categoryName, section: props.section.name }})
    }
    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore

    const updatePosts = async () => {
      colorLog('update posts')
      await projectStore.deleteSection(props.section)
      ctx.emit('update-posts')
    }

    return {
      showBody,
      onRust,
      message,
      toPost,
      setType,
      typeNames,
      selectedType,
      posts,
      newPost,
      updatePosts
    };
  },
});
</script>
