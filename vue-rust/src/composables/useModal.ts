import { ref, readonly } from "vue"

const visible = ref(false)

export function useModal(id?: any) {
  return {
    id: id,
    component: ref(),
    // make it private so that have to use public APIs (show/hide) for interaction / state change
    visible: readonly(visible),
    showModal: () => visible.value = true,
    hideModal: () => visible.value = false,
  }
}