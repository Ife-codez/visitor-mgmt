import { visitor } from '~/server/models/visitor'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const saved = await visitor.create({
      name: body.name,
      purpose: body.purpose,
      phoneNo: body.phoneNo,
      response: null,
      vipId: body.vipId,
      id: body.id,
      date: body.date || new Date()
    })
    return {
      message: 'Visitor registered',
      visitor: saved
    }
  } catch (err) {
    console.error('Failed to save visitor request:', err)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Save failed'}))
  }
})