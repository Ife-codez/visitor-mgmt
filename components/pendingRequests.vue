<template>
  <div class="overflow-x-auto rounded-lg shadow">
    <table class="w-full border-collapse border border-green-300">
      <thead class="bg-gray-100 uppercase">
        <tr>
          <th class="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Purpose</th>
          <th class="border border-gray-300 px-4 py-2 text-left">phone</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody is="transition-group" name="fade" tag="tbody">
        <tr v-for="visitor in requests" :key="visitor.id" class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-2">{{ visitor.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ visitor.purpose }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ visitor.phoneNo }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <div class="flex gap-2">
              <button class="btn" @click="respond(visitor, 'approved')">Approve</button>
              <button class="butn" @click="respond(visitor, 'declined')">Decline</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
 </template>

 <script setup>
import { ref, watch } from 'vue'
import useUser from '~/composables/useUser'
import { useRoom } from '~/composables/useRoom'

const user = useUser()
const requests = ref([])
const ws = useRoom(user.vipId)
onMounted(() => {
  if ('Notification' in window ) {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission)
    })
  }
})
// React to every new WebSocket message
watch(() => ws?.data?.value, (raw) => {
  if (!raw || raw === 'ping' || raw === 'undefined') return

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    return
  }

  if (
    parsed.type === 'visitor-request' &&
    parsed.payload?.vipId === user.vipId
  ) {
    const exists = requests.value.some(v => v.id === parsed.payload.id)
    if (!exists) {
      requests.value.push(parsed.payload)
    }
    if (Notification.permission === 'granted') {
      
      const notify = new Notification('New visitor', {
        body: `visitor: ${parsed.payload.name}`,
        icon: '/favicon.ico'
      })
      notify.onclick = () => {
        window.focus()
        window.location.href = 'vipDashboard'
      }
    }
  }
})

const respond = async (visitor, status) => {
  if (!ws?.send) return
  const payload = {
    ...visitor,
    response: status,
    date: new Date()
  }
  ws.send(
    JSON.stringify({
      type: 'vip-response',
      payload
    })
  )
  try {
    const res = await $fetch('/api/visitor/respond', {
      method: 'POST',
      body: {
        id: payload.id,
        response: payload.response
      }
    })
  } catch (err) {
    console.error('Failed to save response to DB:', err)
  }
  requests.value = requests.value.filter(v => v.id !== visitor.id)
}
onMounted(async () => {
  try {
    const res = await $fetch('/api/visitor/fetch', {
      method: 'GET',
      query: { vipId: user.vipId }
    })
    requests.value = res.filter(v => !v.response)
  } catch (err) {
    console.error('Failed to fetch pending visitors:', err)
  }
})
 </script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>