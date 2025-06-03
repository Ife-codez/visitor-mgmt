import { useToast } from 'vue-toastification'
import type { ToastInterface } from 'vue-toastification'
export default function (): ToastInterface | (() => void) {
  if (typeof window === 'undefined') return () => {}
  const toast = useToast()
  return toast
}