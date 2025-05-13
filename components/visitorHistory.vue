<template>
  <div>
    <table class="min-w-full border text-left">
      <thead>
        <tr>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Phone</th>
          <th class="border px-4 py-2">Status</th>
          <th class="border px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="visitor in history" :key="visitor.id">
          <td class="border px-4 py-2">{{ visitor.name }}</td>
          <td class="border px-4 py-2">{{ visitor.phoneNo }}</td>
          <td class="border px-4 py-2">{{ visitor.response }}</td>
          <td class="border px-4 py-2">{{ formatDate(visitor.date) }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="clearHistory" class="butn">Clear Visitor History</button>

    <!-- <ul>
      <li v-for="visitor in visitors" :key="visitor.id">
        {{ visitor.name }} - {{ visitor.response || 'null' }} on {{ visitor.date }}
      </li>
    </ul> -->

  </div>
</template>

<script setup>

import { ref, watchEffect } from 'vue'
import useUser from '~/composables/useUser'
import { useRoom } from '~/composables/useRoom'

const user = useUser()
const history = ref([])
let ws = null

watchEffect(() => {
  if (!user.vipId) return

  // Reconnect socket when VIP ID is available
  ws = useRoom(user.vipId)
  console.log('[VisitorHistory] Subscribed to room:', user.vipId)

  watch(
    () => ws?.data?.value,
    (raw) => {
      if (!raw || raw === 'ping' || raw === 'undefined' || raw === 'pong') return

      try {
        const parsed = JSON.parse(raw)
        console.log('[VisitorHistory] Message:', parsed)

        if (
          parsed.type === 'vip-response' &&
          parsed.payload?.vipId === user.vipId
        ) {
          const existing = history.value.find(v => v.id === parsed.payload.id)

          if (!existing) {
            history.value.push(parsed.payload)
          } else if (!existing.response && parsed.payload.response) {
            existing.response = parsed.payload.response
          }
        }
      } catch (err) {
        console.error('[VisitorHistory] Failed to parse:', err)
      }
    }
  )
})

const formatDate = (date) => new Date(date).toLocaleString()
onMounted(async () => {
  try {
    const res = await $fetch('/api/visitor/fetch', {
      method: 'GET',
      query: { vipId: user.vipId }
    })
    history.value = res.filter(v => v.response)
  } catch (err) {
    console.error('Failed to fetch visitor history:', err)
  }
})
const clearHistory = async () => {
  if (!confirm('Are you sure you want to clear the visitor history?')) return
  try {
    const res = await $fetch('/api/visitor/clear', {
      method: 'POST',
      body: {vipId: user.vipId}
    })
    history.value = []
    console.log(res.message)
  } catch (err) {
    console.error('Failed to clear history', err)
  }
}
</script>

<style scoped>

</style>