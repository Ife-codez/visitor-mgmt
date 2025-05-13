import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    // if (typeof window !== 'undefined') {
    //   const saved = localStorage.getItem('user')
    //   if (saved) {
    //     return JSON.parse(saved)
    //   }
    // }
    return {
      message: null,
      role: null,
      vipId: null,
      isLoggedIn: false,
    }
  },
    actions: {
      login(user) {
        // this.message = user.message;
        // this.role = user.role;
        // this.vipId = user.vipId;
        // this.isLoggedIn = true;

        this.$patch((state) => {
          state['message'] = user.message;
          state['role'] = user.role;
          state['vipId'] = user.vipId;
          state['isLoggedIn'] = true;
        })

        return true;
        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('user', JSON.stringify ({
        //     message: this.message,
        //     role: this.role,
        //     vipId: this.vipId,
        //     isLoggedIn: true
        //   }))
        // }
      },
      logout() {
        this.message = null;
        this.role = null;
        this.vipId = null;
        this.isLoggedIn = false;

        // if(typeof window !== 'undefined') {
        //   localStorage.removeItem('user')
        // }
      }
    },

    persist: true,
})
  