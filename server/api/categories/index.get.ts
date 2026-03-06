import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  return prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { topics: { where: { published: true } } } },
    },
  })
})
