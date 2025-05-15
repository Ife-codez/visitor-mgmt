// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],
  // piniaPluginPersistedstate: {
  //   storage: 'localStorage',
  // },
  mongoose: {
    uri: process.env.MONGO_URI,
  },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  css: ['vue-toastification/dist/index.css',
    '~/assets/css/toast.css'
  ],
  plugins: ['~/plugins/toast.client.js']
})