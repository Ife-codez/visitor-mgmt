<template>
  <ClientOnly>
    <dashboardLayout role="VIP">
      
      <userCard class="my-10"></userCard>
      <section id="pending" class="mb-12">
      <h2 class="text-2xl font-semibold">Pending requets</h2>
      <pendingRequests />
      </section>

      <section id="history">
        <h2 class="text-2xl font-semibold">Visitor History</h2>
        <visitorHistory />
      </section>
    </dashboardLayout>
  </ClientOnly>
</template>

<script setup>
  import dashboardLayout from '/components/layouts/dashboardLayout.vue'
  import useUser from '~/composables/useUser'

  const user = useUser()
  console.log('VIP Dashboard loaded with VIP ID:', user.vipId)
  console.log(user.name)

</script>

<style scoped>

</style>

