import { useMongooseModel } from '~/server/utils/useMongooseModel'
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, email, role, password, vipId } = body;

  if (!password) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Password is required' }));
  }
  const user = useMongooseModel('User')
  const existingUser = await user.findOne({ email })
  if (existingUser) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User already exists' }))
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  let newUserData = {
    name,
    email,
    role,
    password: hashedPassword
  }
  if (role === 'VIP') {
    newUserData.vipId = `VIP-${Date.now().toString(36)}`
  } else if (role === 'Secretary') {
    if (!vipId) {
      return sendError(event, createError({statusCode:400, statusMessage: 'VIP ID Required'}))
    }
    newUserData.vipId = vipId
  }
  await user.create(newUserData)
  return { message: 'Signup successful', redirect: '/login'}
})

