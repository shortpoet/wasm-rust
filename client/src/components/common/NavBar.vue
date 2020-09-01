<template>
  <nav class="main-nav navbar is-primary">
    <div class="navbar-end">
      <div class="buttons">
        <router-link to="/" class="button">
          <i class="home-icon fa fa-home"></i>
        </router-link>
        <div>
          <!-- <router-link class="button" :to="{name: 'NewPost', params: {id: props.project.id, name: props.project.name}}">New Post</router-link> -->
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
import {useModal} from '../../composables/useModal'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const modal = useModal()
    return {
      modal,
      component: modal.component
    }
  }
})
</script>