
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
          <button class="function-button button is-pulled-right is-rounded" @click.prevent="onRust" style>
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
      const res = await rustAxios("get", "say", { name: parameter.value });
      if (res == 'Please use command curl http://127.0.0.1:8080/say/?name=MyName \n') {
        message.value = 'Please supply a value before activating function'
      } else {
        message.value = res
      }

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