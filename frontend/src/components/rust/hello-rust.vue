<template>
  <div class="panel">
    <div class="panel-block">
      <p class="control">
        <span>Click to activate rust function</span>
        <button class="button is-pulled-right is-rounded" @click.prevent="onRust" style>
          <i class="fa fa-cog"></i>
        </button>
      </p>
    </div>
  </div>
  <div class="post-code-body" v-html="code" />
  <div class="post-code-output">
    <h1 class="subtitle">Rust Message</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { colorLog } from '../../utils/colorLog';
import { rustAxios } from '../../ajax';

export default defineComponent({
  props: {
    code: {
      type: String,
      required: true
    }
  },
  setup () {
    const message = ref();
    const onRust = async () => {
      colorLog("rust message", 1);
      message.value = await rustAxios("get", "say", { name: "shortpoet" });
    };
    return {
      onRust,
      message
    }
  }
})
</script>

<style scoped>

</style>