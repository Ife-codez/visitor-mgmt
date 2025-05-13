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
        <input :type="password" id="password" v-model="loginForm.password" placeholder="Enter Your Password">
      </div>
      <div>
        <button type="button" @click="switchPassword">eye</button>
        <button type="submit">Log In</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  // import { useUserStore } from '~/store/user';
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
  // console.log(userStore.$state);

  const handleLogin = async () => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: loginForm,
      });

      userStore.login({
        message: response.message,
        role: response.role,
        vipId: response.vipId
      })

      alert(`${response.message}`);

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