import { useMongooseModel } from '~/server/utils/useMongooseModel'
import bcrypt from 'bcrypt';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password} = body;
  if (!email || !password) {
    return createError({ statusCode: 400, statusMessage: 'Email and password required' });
  }
  const User = useMongooseModel('User');
  const user = await User.findOne({ email });

  if(!user) {
    return createError({ statusCode: 404, statusMessage: 'user not found'});
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return createError({ statusCode: 401, statusMessage: 'invalid password'});
  }

  return {
    message: 'Login successful',
    role: user.role,
    vipId: user.role === 'Secretary' ? user.vipId : null
  };
});