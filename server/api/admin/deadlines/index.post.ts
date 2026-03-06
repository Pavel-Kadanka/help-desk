import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const { title, description, dueDate, sortOrder } = body

  if (!title || !dueDate) {
    throw createError({ statusCode: 400, message: 'Chybí povinné pole' })
  }

  return prisma.deadline.create({
    data: { title, description: description ?? null, dueDate: new Date(dueDate), sortOrder: sortOrder ?? 0 },
  })
})
