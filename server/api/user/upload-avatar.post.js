import { v2 as cloudinary } from 'cloudinary'
import formidable from 'formidable'
import { useMongooseModel } from '~/server/utils/useMongooseModel'

export const config = {
  api: {
    bodyParser: false
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default defineEventHandler(async (event) => {
  const form = formidable({ keepExtensions: true })
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) reject(err)
      resolve([fields, files])
    })
  })

  const userId = fields.userId
  const file = files.avatar[0].filepath

  const uploadResult = await cloudinary.uploader.upload(file)

  const User = useMongooseModel('User')
  const user = await User.findById(userId)
  if (!user) throw createError({ statusCode: 404, message: 'User not found' })

  user.avatar = uploadResult.secure_url
  await user.save()

  return { avatarUrl: uploadResult.secure_url }
})