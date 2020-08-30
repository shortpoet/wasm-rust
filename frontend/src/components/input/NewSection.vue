<template>
<form action="submit" @submit.prevent="submit">
  <FormInput type="sectionName" name="Section Name" v-model="sectionName" :error="sectionStatus.message"/>
  <button class="button is-success" :disabled="!sectionStatus.valid">Submit</button>
</form>

<teleport to="#modal" v-if="sectionModal.visible">
  <div style="display: flex; align-items: center;">Section is: {{ sectionName }}</div>
</teleport>

</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import FormInput from './FormInput.vue'
import { required, validate, Status, contiguous } from '../../utils/validators'
import { ProjectStore } from '../../store/project/project.store'
import { useStore, PROJECT_STORE_SYMBOL } from '../../store'
import { useModal } from '../../composables/useModal'
import { colorLog } from '../../utils/colorLog'
import { IProject } from '../../interfaces/IProject'

export default defineComponent({
  name: 'NewSection',
  components: {
    FormInput
  },
  props: {
    modal: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const sectionName = ref('')
    const debug = true;
    // derive validity of username in computed property
    // typed as status
    const sectionStatus = computed<Status>(() => {
      return validate(
        sectionName.value, 
        [
          required(),
          contiguous()
        ]
      )
    })


    const projectStore: ProjectStore = useStore<ProjectStore>(PROJECT_STORE_SYMBOL) as ProjectStore
    const sectionModal = useModal('new-section')


    const submit = async (e: any) => {
      // this is a ref so use value
      if (!sectionStatus.value.valid ) {
        return 
      }
      colorLog('submit section', undefined, debug)
      console.log(sectionName.value);
      const curProj = projectStore.getCurrentProject()
      console.log(curProj);
      
      
      const section = await projectStore.createSection(sectionName.value, curProj);
      props.modal.hideModal();
      // can't chain modal calls unless they are registered and used with id bec app modal just acts on any modal
      // successModal.showModal();
    }

    return {
      sectionName,
      submit,
      sectionModal,
      sectionStatus
    }
  }
})
</script>

<style  scoped>
form {
  background: white;
  padding: .5rem;
}
</style>