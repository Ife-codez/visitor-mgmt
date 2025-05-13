<template>
  <div class="flex flex-col items-center gap-[10px] justify-center bg-white p-8 rounded-2xl shadow-lg w-full">
    <h2 class="text-4xl">Sign up page</h2>
    <form @submit.prevent="handleSignup" class="flex flex-col items-center gap-[30px]">
      <!-- name section -->
      <div class="flex flex-col items-center">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="name"  v-model="userData.name" required>
      </div>
      <!-- email section: -->
      <div class="flex flex-col items-center">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="adress" v-model="userData.email" required>
      </div>
      <!-- resgister as -->
      <div class="flex flex-col items-center">
        <label for="register">Register As:</label>
        <select name="role" id="register" v-model="userData.role" required>
          <option value="VIP">VIP</option>
          <option value="Secretary">Secretary</option>
        </select>
      </div>
      <!-- enter your vip id -->
       <div class="flex flex-col items-center" v-if="userData.role === 'Secretary'">
        <label for="VipId">Enter Vip ID</label>
        <input type="text" id="VipId" name="vipId" v-model="userData.vipId" placeholder="Enter your vip id" required>
       </div>
      <!-- password section -->
      <div class="flex flex-col items-center">
        <label for="password">Set password</label>
        <input type="password" id="password" name="password" placeholder="create strong passoword" v-model="userData.password" required>
      </div>
      <!-- submit -->
      <div>
        <button type="submit" class="btn">Sign up</button>
      </div>
    </form>       
                                                                
  </div>
</template>

<script setup>
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
    console.log(res.message)
    navigateTo(res.redirect)
  } catch (error) {
    console.error('Signup failed: ', error?.data?.message || error)
  }
}

</script>

<style  scoped>
  input, select {
    border: 2px solid gray;
    width: 100%;
    padding: 5px 15px;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, box shadow 0.2s;
  }
  input:focus, select:focus {
    border-color: #12b488;
    box-shadow: 0 0 0 2px rgba(15, 156, 117, 0.3)
  }

</style>