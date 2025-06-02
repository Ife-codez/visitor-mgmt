<template>
  <div>
    <header class="bg-white shadow-md">
      <nav class="container mx-auto p-4 flex justify-between">
        <NuxtLink to="/" class="font-bold">Vizitor</NuxtLink>
        <ul class="flex gap-4">
          <li v-for="link in navLinks" :key="link.name">
            <a :href="`#${link.section}`" class="btn">{{ link.name }}</a>
          </li>
        </ul>
      </nav>
    </header>

    <div class="container mx-auto p-4">
      <slot />
    </div> 

    <footer class="text-center py-4 border-t mt-4">
      @2025 Visitor Management System
      <footer />
    </footer>
  </div>
</template>

<script setup>
  import footer from '~/components/footer.vue'
  const props = defineProps({
    role: String,
  })
  const vipLinks = [
    {name: 'View pending requests', section: 'pending'},
    {name: 'View visitor history', section: 'history'}
  ]
  const secretaryLinks = [
  {name: 'Register Visitors', section: 'register'},
  {name: 'Manage Visitor History', section: 'history'}
  ]

  const navLinks = props.role === 'VIP' ? vipLinks : secretaryLinks
</script>

<style  scoped>

</style>