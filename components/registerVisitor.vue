<template>
  <div>
    <form @submit.prevent="registerVisitor" class="flex flex-col mx-auto gap-[15px] w-[80%]">
      <div class="flex flex-col gap[10px]">
        <label for="visitor-name">Enter Vistor's Name:</label>
        <input type="text" id="visitor-name" placeholder="Enter visitor name" v-model="visitor.name">
      </div>

      <div class="flex flex-col gap[10px]">
        <label for="purpose">Visitor's Purpose Of Visit</label>
        <textarea name="visit-purpose" id="purpose" v-model="visitor.purpose" class="border border-gray-500 py-[5px] px[5px]"></textarea>
      </div>

      <div class="flex flex-col gap[10px]">
        <label for="phone">Phone Number</label>
        <input type="text" id="phone" placeholder="phone number" v-model="visitor.phoneNo">
      </div>

      <div>
        <button type="submit" class="btn">Register</button>
      </div>
    </form>

  </div>
</template>

<script setup>
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