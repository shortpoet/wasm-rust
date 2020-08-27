<template>
  <nav class="navbar">
    <div class="navbar-end">
      <div class="buttons">

        <router-link to="/" class="button">Home</router-link>

        <div>
          <router-link class="button" :to="{path: '/posts/new'}">New Post</router-link>
        </div>
        
      </div>
      </div>

    <teleport to="#modal" v-if="modal.visible">
      <component :is="component" :modal="modal"/>
    </teleport>

  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {useModal} from '../composables/useModal'
import { useStore } from '../store'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const modal = useModal()
    const store = useStore()
    return {
      modal,
      component: modal.component
    }
  }
})
</script>