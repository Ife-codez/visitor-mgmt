<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <form @submit.prevent="handleLogin" class="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 class="text-2xl font-bold text-center">Log in page</h2>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="loginForm.email" placeholder="email.." class="input" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input :type="password" id="password" v-model="loginForm.password" placeholder="Enter Your Password" class="input" required>
      </div>
      <div>
        <button type="button" @click="switchPassword">eye</button>
        <button type="submit" class="btn w-full">Log In</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { useToast } from 'vue-toastification'
  const toast = useToast()
  import { reactive } from 'vue'
  
  const userStore = useUser();

  const password = ref('password')

  const switchPassword = () => {
    if(password.value === 'password'){
      password.value = 'text'
      return;
    }

    password.value = 'password'
  }
  const loginForm = reactive ({
    email: 'ifemoneyy@gmail.com',
    password: 'ifeoluwa123'
  })
  

  const handleLogin = async () => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: loginForm,
      });

      userStore.login({
        name: response.name,
        message: response.message,
        role: response.role,
        _id: response._id,
        avatar: response.avatar,
        vipId: response.vipId
      })

      toast(response.message, {
        type: 'success',
        toastClassName: 'my-toast'
      })
      

      if(response.role === 'VIP') {
        navigateTo('/vipDashboard');
      } else if (response.role === 'Secretary') {
        navigateTo('secDashboard');
      }
    } catch (error) {
      toast('Login failed, Try again', {
        type: 'error',
        toastClassName: 'my-toast1'
      })
    }
  };
</script>

<style scoped>
  

</style>