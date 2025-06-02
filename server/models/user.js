import { defineMongooseModel } from '#nuxt/mongoose'
export default defineMongooseModel('User', {
  name: String,
  email: {type: String, unique: true},
  password: String,
  role: {type: String, enum: ['VIP', 'Secretary'], required: true},
  vipId: {type: String, default: null},
  avatar: String
})