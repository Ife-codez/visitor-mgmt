import { defineMongooseModel } from '#nuxt/mongoose'
export const visitor =  defineMongooseModel('Visitor', {
  name: String,
  purpose: String,
  phoneNo: String,
  response: String,
  statusMessage: String,
  vipId: String,
  id: String,
  date: Date,
})