<template>
  <div class="w-full flex justify-center px-4">
    <form @submit.prevent="registerVisitor" class="w-full max-w-md sm:max-w-[80%] bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 class="text-xl font-bold mb-4 text-center">Register A Visitor</h2>
      <div>
        <label for="visitor-name" class="block font-medium mb-1">Enter Vistor's Name:</label>
        <input type="text" id="visitor-name" placeholder="Enter visitor name" class="input" v-model="visitor.name" required>
      </div>

      <div>
        <label for="purpose" class="block font-medium mb-1">Visitor's Purpose Of Visit</label>
        <textarea name="visit-purpose" id="purpose" v-model="visitor.purpose" class="input h-24 resize-none" required></textarea>
      </div>

      <div>
        <label for="phone" class="block font-medium mb-1">Phone Number</label>
        <input type="text" id="phone" placeholder="phone number" v-model="visitor.phoneNo" class="input" required>
      </div>

      <div>
        <button type="submit" class="btn w-full">Send Notification</button>
      </div>
    </form>

  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'
const toast = useToast()
import { ref } from 'vue'
import { useRoom } from '~/composables/useRoom'
import useUser from '~/composables/useUser'

const user = useUser()

const visitor = ref({
  name: '',
  purpose: '',
  phoneNo: '',
})
const ws = ref(null)
watchEffect(() => {
  if (user.vipId) {
    ws.value = useRoom(user.vipId)
    if (ws.value?.readyState) {
      const map = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
      watchEffect( () => {
        console.log('Socket state:', map[ws.value.readyState.value])
      })
    }
  }
})  

const registerVisitor = async () => {
  if (!ws.value?.send) return
  const id = genRand()
  const visitorData = {
    ...visitor.value,
    id,
    date: new Date(),
    vipId: user.vipId
  }
  ws.value.send(
    JSON.stringify({
      type:'visitor-request',
      payload: visitorData
    })
  )
  toast('Notification sent!', {
      type: 'success',
      toastClassName: 'my-toast'
    })
  try {
    const response = await $fetch('/api/visitor/request', {
      method: 'POST',
      body: visitorData
    })
    console.log('Saved to MongoDB:', response)
  } catch (err) {
    console.error('Failed to save visitor to DB:', err)
  }
  visitor.value.name = ''
  visitor.value.purpose = ''
  visitor.value.phoneNo = ''
}


</script>

<style scoped>
input {
    border: 2px solid gray;
    width: 100%;
    padding: 5px 15px;
  }
</style>