<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 items-center justify-between bg-white shadow rounded-lg px-6 py-4 max-w-xl w-full">
    <div class="flex item-center gap-4">
      <div class="relative group">
        <img :src="avatar" alt="profile picture" class="w-14 h-14 rounded-full object-cover border">
        <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange">
      </div>
      <div>
        <p class="text-gray-800 font-semibold text-lg md:text-xl">Hello, {{ user.name }}</p>
        <p class="text-lg text-gray-500">Welcome to your Dashboard</p>
        <p class="text-sm font-medium capitalize mt-1">Role: {{ user.role }}</p>
        <p v-if="user.role === 'VIP'" class="text-sm text-gray-700 mt-1">VIP ID: <span class="font-medium">{{ user.vipId }}</span></p>
      </div>
    </div>
    <div v-if="user.role === 'VIP'"><button @click="copyId" class="btn">copy ID</button></div>
  </div>
</template>

<script setup>
import useUser from '~/composables/useUser'
import { useClipboard } from '@vueuse/core';
import useCustomToast from '~/composables/useCustomToast';
const toast = useCustomToast();
const user = useUser()
const { copy } = useClipboard()
const avatar = computed(() => user.avatar || 'https://i.pravatar.cc/100')
const copyId = () => {
  copy(user.vipId)
   toast('Copied!', {
        type: 'success',
        toastClassName: 'my-toast'
      })

}
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if(!file) return
  const formData = new FormData()
  formData.append('avatar', file)
  formData.append('userId', user._id)
  try {
    const response = await $fetch('/api/user/upload-avatar', {
      method: 'POST',
      body: formData
    })
    user.avatar = response.avatarUrl
    toast('Profile updated!', {
        type: 'success',
        toastClassName: 'my-toast'
      })
  } catch (err) {
    toast('upload failed', {
        type: 'error',
        toastClassName: 'my-toast1'
      })
  }
 
}

</script>

<style scoped>

</style>