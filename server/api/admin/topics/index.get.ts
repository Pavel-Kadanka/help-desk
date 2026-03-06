import { prisma } from '~~/server/utils/prisma'
import { requireAdmin } from '~~/server/utils/requireAdmin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return prisma.topic.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { category: { select: { id: true, name: true, slug: true } } },
  })
})
