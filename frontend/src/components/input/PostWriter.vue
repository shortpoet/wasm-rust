<template>
  <div>
    <div class="columns">
      <div class="column is-three-fourths">
        <!-- <FormInput type="text" name="Project Section" v-model="section" :error="sectionStatus.message"/> -->
        <!-- <FormInput type="text" name="Post Section" v-model="section" :error="sectionStatus.message"/> -->
        <FormInput type="text" name="Post Title" v-model="title" :error="titleStatus.message"/>
      </div>
      <div class="column is-one-fourths">
        <button @click="submit" class="button is-primary is-pulled-right" data-test="submit-post">
          Submit
        </button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-half">
        <!-- input only uses text on one line
        textarea does not implement syntax highlighting and other features
        contentEditable allows to write any text in div
        but can't use with v-model - implementation here -->
        <!-- new kind of ref 'template ref' to keep track of user entered value instead of v-model -->
        <!-- box panel message card content textarea input -->
        <div contenteditable id="markdown" class="box" ref="contentEditable" @input="handleEdit" data-test="markdown">
        </div>
      </div>
      <div class="column is-one-half">
        <div v-html="html"></div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed, Ref } from 'vue'
import { IPost } from '../../interfaces/IPost'
import marked from 'marked'
import hljs from 'highlight.js'
import debounce from 'lodash/debounce'
import { Status, validate, contiguous, required } from '../../utils/validators'
import FormInput from './FormInput.vue'
import { colorLog } from '../../utils/colorLog'
import { ICreatePost } from '../../interfaces/ICreatePost'

export default defineComponent({
  name: 'PostWriter',
  components: {
    FormInput
  },
  props: {
    post: {
      type: Object as () => IPost,
      required: true
    }
  },
  
  setup(props, ctx) {
    const title = ref(props.post.title)
    const section = ref(props.post.sectionName ? props.post.sectionName : '')
    colorLog('post writer')
    console.log(section.value);
    
    // declare new ref with initial value null
    // because needs to execute setup first
    const contentEditable = ref<null | HTMLDivElement>(null)
    const markdown = ref(props.post.markdown)
    const html = ref('')
    const options: marked.MarkedOptions =  {
      // takes function that return code with syntax hightlighting
      highlight: (code: string) => hljs.highlightAuto(code).value
    }
    const titleStatus = computed<Status>(() => {
      return validate(
        title.value, 
        [
          contiguous(),
          required()
        ]
      )
    })
    const sectionStatus = computed<Status>(() => {
      return validate(
        section.value, 
        [
          required()
        ]
      )
    })
    const handleEdit = () => {
      // eslint-disable-next-line
      markdown.value = contentEditable.value!.innerText
    }
    const update = (value: string) => html.value = value ? marked.parse(value, options) : marked.parse('', options)
    watch(
      () => props.post.title,
      () => title.value = props.post.title,
      { immediate: true }
    )
    watch(
      () => section.value,
      () => section.value = props.post.sectionName,
      { immediate: true }
    )
    watch(
      // eslint-disable-next-line
      // because can be null
      () => markdown.value!,
      // still a function with same signature - just a func returning string so can pass in like this
      debounce(update, 500),
      // use optional 3rd arguement to have watch function called onMounted instead of manually copying logic in that hook
      { immediate: true }
    )

    const submit = () => {
      const createPost: Ref<ICreatePost> = computed(() => ({
        
        ...props.post,
        title: title.value,
        markdown: markdown.value,
        html: html.value,
        sectionName: props.post.sectionName,
        projectName: props.post.projectName,
        categoryName: props.post.categoryName
      }))
      ctx.emit(
        'save',
        createPost.value
      )
    }

    // need to use on mounted hook to manually update a dom element to ensure it isn't null
    onMounted(() => {
      // eslint-disable-next-line
      if (contentEditable!.value!.innerText) {
        // eslint-disable-next-line
        console.log(markdown.value);
        
        contentEditable!.value!.innerText = markdown.value || '';
      }
    })

    return {
      section,
      sectionStatus,
      title,
      titleStatus,
      contentEditable,
      handleEdit,
      markdown,
      html,
      submit
    }
  }
})
</script>

WebAssembly (often shortened to Wasm) is an open standard that defines a portable binary-code format for executable programs, and a corresponding textual assembly language, as well as interfaces for facilitating interactions between such programs and their host environment.[1][2][3][4] The main goal of WebAssembly is to enable high-performance applications on web pages, but the format is designed to be executed and integrated in other environments as well, including standalone ones.[5][6][7]

WebAssembly (i.e. WebAssembly Core Specification and WebAssembly JavaScript Interface[8]) became a World Wide Web Consortium recommendation on 5 December 2019[9] and, alongside HTML, CSS, and JavaScript, is the fourth language to run natively in browsers