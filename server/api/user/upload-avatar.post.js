import formidable from 'formidable'
import path, { join } from 'path'
import { useMongooseModel } from '~/server/utils/useMongooseModel'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  const form = formidable({ uploadDir, keepExtensions: true })

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) reject(err)
      resolve([fields, files])
    })
  })

  const userId = fields.userId
  const file = files.avatar[0]
  const filename = path.basename(file.filepath)
  const avatarPath = `/uploads/${filename}`

  const User = useMongooseModel('User')
  const user = await User.findById(userId)
  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found!' })
  }

  user.avatar = avatarPath
  await user.save()

  console.log('Avatar saved at:', avatarPath)

  return { avatarUrl: avatarPath }
})