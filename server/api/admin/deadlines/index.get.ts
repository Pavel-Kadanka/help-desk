import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return prisma.deadline.findMany({ orderBy: { dueDate: 'asc' } })
})
