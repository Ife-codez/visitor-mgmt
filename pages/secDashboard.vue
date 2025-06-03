<template>
  <div>
    <ClientOnly>
      <dashboardLayout role="Secretary">

        <userCard class="my-10 mx-auto"></userCard>
        <section id="register" class="mb-12">
        <registerVisitor />
        </section>

        <section id="history">
          <h2 class="text-2xl font-semibold">Visitor History</h2>
          <visitorHistory />
        </section>
      </dashboardLayout>
    </ClientOnly>
  </div>
</template>

<script setup>
  import dashboardLayout from '/components/layouts/dashboardLayout.vue'
  import useUser from '~/composables/useUser'

  const user = useUser()

</script>

<style scoped>

</style>
