
<template>
  <div class="panel">
    <div class="panel-block">
        <p :v-html="postHtml"></p>
      <div class="control">
        <div class="input-panel">
          <FormInput type="text" name="parameter" v-model="parameter" :error="parameterStatus.message"/>
        </div>
        <div class="activate-panel">
          <span>Click to activate rust function</span>
          <button class="button is-pulled-right is-rounded" @click.prevent="onRust" style>
            <i class="fa fa-cog"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="post-code-body" v-html="code" /> -->
  <div class="post-code-output">
    <h1 class="subtitle">Rust Message</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
/* tslint:disable */
/* eslint-disable */

import { defineComponent, ref, computed } from 'vue'
import { colorLog } from '../../utils/colorLog';
import { rustAxios } from '../../ajax';
import FormInput from '../input/FormInput.vue'
import { Status, validate, required } from '../../utils/validators';
import * as say from "wasm-hello-world"

// const runWasm = async () => {
//   // Instantiate our wasm module
//   const helloWorld = await init("./pkg/hello_world_bg.wasm");

//   // Call the Add function export from wasm, save the result
//   const addResult = helloWorld.add(24, 24);

//   // Set the result onto the body
//   document.body.textContent = `Hello World! addResult: ${addResult}`;
// };
// runWasm();
export default defineComponent({
  components: {
    FormInput
  },
  props: {
    postHtml: {
      type: String,
      required: true
    }
  },
  setup () {
    const message = ref();
    const parameter = ref('');
    const parameterStatus = computed<Status>(() => {
      return validate(
        parameter.value, 
        [
          required()
        ]
      )
    })

    const onRust = async () => {
      colorLog("rust message", 1);
      // message.value = await rustAxios("get", "say", { name: "shortpoet" });
      message.value = await say("shortpoe");

    };
    return {
      onRust,
      message,
      parameter,
      parameterStatus
    }
  }
})
</script>

<style scoped>

</style>