<template>
  <div class="flex flex-col items-center gap-[10px]">
    <h2 class="text-4xl">Log in page</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col items-center gap-[30px]">
      <div class="flex flex-col items-center">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="loginForm.email" placeholder="email..">
      </div>
      <div class="flex flex-col items-center">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="loginForm.password" placeholder="Enter Your Password">
      </div>
      <div>
        <button type="submit">Log In</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  const loginForm = reactive ({
    email: '',
    password: ''
  })

  const handleLogin = async () => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: loginForm,
      });

      console.log('Login successful:', response);

      if(response.role === 'VIP') {
        navigateTo('/vipDashboard');
      } else if (response.role === 'Secretary') {
        navigateTo('secDashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.data || error);
    }
  };
</script>

<style scoped>
  input {
    border: 2px solid gray;
    width: 100%;
    padding: 5px 15px;
  }

</style>