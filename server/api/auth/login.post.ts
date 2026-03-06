import bcrypt from 'bcrypt'
import { prisma } from '~~/server/utils/prisma'
import { signToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email a heslo jsou povinné' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Nesprávný email nebo heslo' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Nesprávný email nebo heslo' })
  }

  const config = useRuntimeConfig()
  const token = signToken({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret)

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }
})
