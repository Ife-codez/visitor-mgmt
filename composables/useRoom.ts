import { useWebSocket } from '@vueuse/core'

export const useRoom = (roomId: string) => {
  if (!roomId) return null

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const url = `${protocol}://${window.location.host}/api/socket?room=${roomId}`

  console.log('[useRoom] connecting to:', url)

  return useWebSocket(url, {
    autoReconnect: true,
    heartbeat: {
      message: 'ping',
      interval: 10000,
    },
  })
}