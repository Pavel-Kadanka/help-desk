import { verifyToken } from '~~/server/utils/jwt'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) return null

  const payload = verifyToken(token, config.jwtSecret)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  })

  return user
})
