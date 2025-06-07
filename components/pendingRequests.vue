<template>
  <div class="overflow-x-auto rounded-lg shadow">
    <table class="w-full border-collapse border border-green-300">
      <thead class="bg-gray-100 uppercase">
        <tr>
          <th class="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Purpose</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Phone</th>
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
              <button class="btn" @click="openModal(visitor, 'Approved')">Approve</button>
              <button class="butn" @click="openModal(visitor, 'Declined')">Decline</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  
    <!-- Modal -->
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
        <h3 class="text-lg font-bold mb-4">{{ modalType }} Visitor</h3>

        <!-- Radio options -->
        <div class="space-y-3">
          <label
            v-for="option in modalType === 'Approved' ? approveOptions : declineOptions"
            :key="option"
            :for="option"
            class="flex items-center gap-3 p-3 border rounded hover:bg-gray-100 transition cursor-pointer w-full"
          >
            <input
              type="radio"
              :id="option"
              :value="option"
              v-model="selectedReason"
              class="accent-green-600 w-5 h-5"
            />
            <span class="text-gray-800">{{ option }}</span>
          </label>
        </div>

        <!-- Custom message -->
        <textarea
          v-model="selectedReason"
          placeholder="Or type a custom message..."
          class="w-full border mt-4 p-2 rounded"
        ></textarea>

        <!-- Buttons -->
        <div class="mt-5 flex justify-end gap-3">
          <button @click="showModal = false" class="butn">Cancel</button>
          <button @click="submitModal" class="btn">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import useUser from '~/composables/useUser'
import { useRoom } from '~/composables/useRoom'

const user = useUser()
const requests = ref([])
const ws = useRoom(user.vipId)

// Modal state
const showModal = ref(false)
const modalType = ref('') // 'Approved' or 'Declined'
const selectedReason = ref('')
const selectedVisitor = ref(null)

const approveOptions = ['Come in', 'Wait a few minutes', 'Come back later']
const declineOptions = ['VIP not available', 'Try again later', 'Reschedule']

const openModal = (visitor, type) => {
  selectedVisitor.value = visitor
  modalType.value = type
  selectedReason.value = ''
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedVisitor.value = null
  selectedReason.value = ''
}

const submitModal = async () => {
  if (!ws?.send || !selectedVisitor.value || !modalType.value) return

  const statusMessage = `${modalType.value} – ${selectedReason.value || 'No additional info'}`
  const payload = {
    ...selectedVisitor.value,
    response: modalType.value.toLowerCase(),
    statusMessage,
    date: new Date()
  }

  ws.send(JSON.stringify({
    type: 'vip-response',
    payload
  }))

  try {
    await $fetch('/api/visitor/respond', {
      method: 'POST',
      body: {
        id: payload.id,
        response: payload.response,
        statusMessage: payload.statusMessage
      }
    })
  } catch (err) {
    console.error('Failed to save response to DB:', err)
  }

  requests.value = requests.value.filter(v => v.id !== selectedVisitor.value.id)
  closeModal()
}

onMounted(() => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission)
    })
  }
})

// Listen for new visitor requests
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