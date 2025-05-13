import { visitor } from '~/server/models/visitor'
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const updated = await visitor.findOneAndUpdate(
      { id: body.id },
      { response: body.response },
      { new: true }
    )
    if (!updated) throw new Error('Visitor not found')
    return {
      message: 'Visitor response saved',
      visitor: updated
    }

  } catch (err) {
    console.error('Failed to update visitor response:', err)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Update failed'}))
    
  }
})