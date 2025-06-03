import { useToast as toasty } from 'vue-toastification'
export default function(){

  if (typeof window === 'undefined') return () => {}
  const toast = toasty();
  return toast;
}