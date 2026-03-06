import { verifyToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (token) {
    const payload = verifyToken(token, config.jwtSecret)
    if (payload) {
      event.context.user = payload
    }
  }
})
