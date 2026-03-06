import type { H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
  const user = event.context.user as { userId: number; email: string; role: string } | undefined
  if (!user) throw createError({ statusCode: 401, message: 'Nepřihlášen' })
  if (user.role !== 'admin') throw createError({ statusCode: 403, message: 'Přístup odepřen' })
  return user
}
