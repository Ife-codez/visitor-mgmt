import { visitor } from '~/server/models/visitor'
export default defineEventHandler(async (event) => {
  const vipId = getQuery(event).vipId

  if (!vipId) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing vipId'}))
  }
  const visitors = await visitor.find({ vipId }).sort({ date: -1 })
  return visitors
})