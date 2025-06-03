import Toast, { POSITION } from 'vue-toastification'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.TOP_CENTER,
    timeout: 3000
  })
})