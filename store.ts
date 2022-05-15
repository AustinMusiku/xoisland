import { reactive } from '@nuxtjs/composition-api'

export const flag = reactive({
  value: 1,
  increment() { this.value++ },
  decrement() { this.value-- },
  reset() { this.value = 1 }
})