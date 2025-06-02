<template>
  <div>
    <button @click="logout" class="butn">logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useUser from '~/composables/useUser'

const router = useRouter()
const user = useUser()
const logout = () => {
  user.logout()
  router.push('/login')
}
</script>

<style scoped>

</style>