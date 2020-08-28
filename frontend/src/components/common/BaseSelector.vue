<template>
  <div class="selector-container">
    <label :for="name" class="label" :class="['label', small ? 'is-small' : '']">{{name}}</label>
    <div class="select">
      <select 
        @input="handleInput"
      >
        <option
          v-for="(option, i) in options"
          :key="i"
          :for="`base-switch-${itemType}-${type}-${i}`"
          class="base-switch label checkbox is-small"
          :selected="option == defaultValue ? true : false"
        >
          {{ option }}
        </option> 
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed} from 'vue'
import { colorLog } from '../../utils/colorLog';

  export default defineComponent({

    name: 'BaseSelector',

    props: {
      type: {
        type: String,
        default: 'text'
      },
      name: {
        type: String,
        requred: true
      },
      modelValue: {
        type: String,
        required: true
      },
      small: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        required: true
      },
      itemType: {
        type: String,
        required: true
      },
      defaultValue: {
        type: String,
        required: false
      }

    },

    setup(props, ctx) {
      console.log(props.defaultValue);
      
      const handleInput = (event: any) => {
        // emitting special update event with modifier called modelValue updated the prop which is v-model
        colorLog('base selector input')        
        ctx.emit('update:modelValue', {type: props.itemType, value: event.target.value})
      }
      return {
        handleInput
      }

    }

  })

</script>

<style scoped lang="scss">
div.selector-container{
  // display: flex;
  // flex-direction: column;
}
</style>