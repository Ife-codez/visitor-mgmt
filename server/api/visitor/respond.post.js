import { visitor } from '~/server/models/visitor'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Ensure both fields exist
    if (!body.id || !body.response || !body.statusMessage) {
      throw new Error('Missing required fields')
    }

    const updated = await visitor.findOneAndUpdate(
      { id: body.id },
      {
        response: body.response,
        statusMessage: body.statusMessage, // ✅ Save full message
        date: new Date() // Optional: Update timestamp
      },
      { new: true }
    )

    if (!updated) throw new Error('Visitor not found')

    return {
      message: 'Visitor response saved',
      visitor: updated
    }

  } catch (err) {
    console.error('Failed to update visitor response:', err)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Update failed' }))
  }
})