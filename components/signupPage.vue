<template>
  <div class="flex flex-col items-center min-h-screen mx-auto px-4 py-8">
    <form @submit.prevent="handleSignup" class="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 class="text-2xl font-bold text-center">Sign up page</h2>
      <!-- name section -->
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="name"  v-model="userData.name" required class="input" :disabled="isLoading">
      </div>
      <!-- email section: -->
      <div>
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="address" v-model="userData.email" required class="input" :disabled="isLoading">
      </div>
      <!-- register as -->
      <div>
        <label for="register">Register As:</label>
        <select name="role" id="register" v-model="userData.role" class="input" required :disabled="isLoading">
          <option value="VIP">VIP</option>
          <option value="Secretary">Secretary</option>
        </select>
      </div>
      <!-- enter your vip id -->
       <div v-if="userData.role === 'Secretary'">
        <label for="VipId">Enter Vip ID</label>
        <input type="text" id="VipId" name="vipId" class="input" v-model="userData.vipId" placeholder="Enter your vip id" required :disabled="isLoading">
       </div>
      <!-- password section -->
      <div>
        <label for="password">Set password</label>
        <div class="relative">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            name="password" 
            placeholder="create strong password" 
            v-model="userData.password" 
            class="input pr-10" 
            required
            :disabled="isLoading"
          >
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            :disabled="isLoading"
          >
            <!-- Eye OFF icon (password hidden) -->
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <!-- Eye ON icon (password visible) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      <!-- submit -->
      <div>
        <button type="submit" class="btn w-full" :disabled="isLoading">
          {{ isLoading ? 'Signing up...' : 'Sign up' }}
        </button>
      </div>
    </form>       
                                                                
  </div>
</template>

<script setup>
import useCustomToast from '~/composables/useCustomToast';
import { reactive, ref } from 'vue'

const toast = useCustomToast();
const isLoading = ref(false);
const showPassword = ref(false);

const userData = reactive({
  name: '',
  email: '',
  role: 'Secretary',
  password: '',
  vipId: ''
})

const handleSignup = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: userData.password,
        vipId: userData.vipId || null
      }
    })
    toast(res.message, {
      type: 'success',
      toastClassName: 'my-toast'
    })
    
    navigateTo(res.redirect)
  } catch (error) {
    toast('Signup failed, Try again', {
      type: 'error',
      toastClassName: 'my-toast1'
    })
  } finally {
    isLoading.value = false;
  }
}

</script>

<style scoped>
  
</style>