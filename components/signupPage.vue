<template>
  <div class="flex flex-col items-center min-h-screen mx-auto px-4 py-8">
    <form @submit.prevent="handleSignup" class="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 class="text-2xl font-bold text-center">Sign up page</h2>
      <!-- name section -->
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="name"  v-model="userData.name" required class="input">
      </div>
      <!-- email section: -->
      <div>
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="adress" v-model="userData.email" required class="input">
      </div>
      <!-- resgister as -->
      <div>
        <label for="register">Register As:</label>
        <select name="role" id="register" v-model="userData.role" class="input" required>
          <option value="VIP">VIP</option>
          <option value="Secretary">Secretary</option>
        </select>
      </div>
      <!-- enter your vip id -->
       <div v-if="userData.role === 'Secretary'">
        <label for="VipId">Enter Vip ID</label>
        <input type="text" id="VipId" name="vipId" class="input" v-model="userData.vipId" placeholder="Enter your vip id" required>
       </div>
      <!-- password section -->
      <div>
        <label for="password">Set password</label>
        <input type="password" id="password" name="password" placeholder="create strong passoword" v-model="userData.password" class="input" required>
      </div>
      <!-- submit -->
      <div>
        <button type="submit" class="btn w-full">Sign up</button>
      </div>
    </form>       
                                                                
  </div>
</template>

<script setup>
import useCustomToast from '~/composables/useCustomToast';
  const toast = useCustomToast();
import { reactive } from 'vue'

const userData = reactive({
  name: '',
  email: '',
  role: 'Secretary',
  password: '',
  vipId: ''
})

const handleSignup = async () => {
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
  }
}

</script>

<style  scoped>
  
</style>