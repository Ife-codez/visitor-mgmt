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
      _id: null,
      name: null,
      message: null,
      role: null,
      vipId: null,
      avatar: null,
      isLoggedIn: false,
    }
  },
    actions: {
      login(user) {
        
        this.$patch((state) => {
          state['_id'] = user._id,
          state['name'] = user.name;
          state['avatar'] = user.avatar
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
        this.name = null;
        this.message = null;
        this.role = null;
        this.vipId = null;
        this.isLoggedIn = false;
        this.avatar = null,
        this._id = null

        // if(typeof window !== 'undefined') {
        //   localStorage.removeItem('user')
        // }
      }
    },

    persist: true,
})
  