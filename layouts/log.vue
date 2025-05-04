<template>
  <div>
    <header class="shadow-md bg-white">
      <nav class="container mx-auto p-4 flex justify-between">
        <NuxtLink to="/" class="font-bold">Vizitor</NuxtLink>
        <ul class="flex gap-4">
          <li><NuxtLink to="/">Sign Up</NuxtLink></li>
          <li><NuxtLink to="/login">Log In</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <div class="container mx-auto p-4">
      <slot />
    </div>                                                               
  </div>
</template>

<script setup>

</script>

<style scoped>
  .router-link-exact-active {
    color: #12b488;
  }

</style>