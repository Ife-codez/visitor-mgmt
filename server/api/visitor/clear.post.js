import { visitor } from '~/server/models/visitor'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.vipId) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing vipId'}))
  }
  const deleted = await visitor.deleteMany({
    vipId: body.vipId,
    response: { $ne: null}
  })
  return {
    message: 'Visitor history cleared',
    deletedCount: deleted.deletedCount
  }
})